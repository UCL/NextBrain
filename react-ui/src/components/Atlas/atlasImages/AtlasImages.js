import React, { useState, useEffect } from "react";
import ndarray from "ndarray";

import npyjs from "../../utils/npy";
import txtToArray from "../../utils/txtToArray";
import matrixMultiplier from "../../utils/matrixMultiplier";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriImages from "./MriImages";
import HistologyImage from "./HistologyImage";

import CORONAL_RESCALING_FACTOR from "../../utils/CoronalRescalingFactor";

import "./AtlasImages.css";

const AtlasImages = () => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState(null);
	const [histologyImageCoords, setHistologyImageCoords] = useState(null);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		updateAtlasImages("sagittal", 113, 235, 113, 149, 47, 50);
	}, []);

	const updateAtlasImages = async (
		currentPlane,
		currentSlice,
		axisX,
		axisY,
		axisZ,
		mouseX,
		mouseY
	) => {
		const newMriCoords = calculateMriImageCoords(
			currentPlane,
			currentSlice,
			axisX,
			axisY,
			axisZ
		);
		const newHistologyCoords = await calculateHistologyImageCoords(
			currentPlane,
			currentSlice,
			axisX,
			axisY,
			axisZ,
			mouseX,
			mouseY
		);
		console.log(newHistologyCoords);

		setMriImageCoords(newMriCoords);
		setHistologyImageCoords(newHistologyCoords);
	};

	const calculateHistologyImageCoords = async (
		currentPlane,
		currentSlice,
		axisX,
		axisY,
		axisZ,
		mouseX,
		mouseY
	) => {
		const currentBlock = await getCurrentBlock(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY
		);
		console.log(currentBlock);

		// TODO: I need to convert the array of strings to numbers (although it still works regardless)
		const matrix = await getCurrentMatrix(currentBlock);
		if (matrix === undefined) {
			return;
		}
		console.log(matrix);

		// let histologyImageCoords = matrixMultiplier(matrix, [
		// 	mouseX,
		// 	mouseY,
		// 	currentSlice + 1,
		// 	1,
		// ]);

		// are these orders correct? Or do we always enter them as (mouseX, mouseY, slice, 1)?
		let histologyImageCoords;
		if (currentPlane === "sagittal") {
			histologyImageCoords = matrixMultiplier(matrix, [
				axisX,
				axisY + 1,
				axisZ,
				1,
			]);
		} else if (currentPlane === "coronal") {
			histologyImageCoords = matrixMultiplier(matrix, [
				axisX + 1,
				axisY,
				axisZ,
				1,
			]);
		} else if (currentPlane === "axial") {
			histologyImageCoords = matrixMultiplier(matrix, [
				axisX,
				axisY,
				axisZ + 1,
				1,
			]);
		}

		console.log(histologyImageCoords, currentBlock);
		return { coords: histologyImageCoords, currentBlock: currentBlock };
	};

	const getCurrentMatrix = async (currentBlock) => {
		if (currentBlock === 0) {
			console.log("block returned 0");
			return;
		}

		let readTxt = new txtToArray();

		const paddedBlock = currentBlock.toString().padStart(2, 0);
		console.log(paddedBlock);

		const txtFile =
			await require(`../../../assets/P57-16/mri/matrices/block_${paddedBlock}.txt`)
				.default;

		const matrix = await readTxt.load(txtFile);

		return matrix;
	};

	const getCurrentBlock = async (
		currentPlane,
		currentSlice,
		mouseX,
		mouseY
	) => {
		let n = new npyjs();

		const paddedSlice = currentSlice.toString().padStart(3, 0);

		const npyFile =
			await require(`../../../assets/P57-16/mri/indices_${currentPlane}/slice_${paddedSlice}.npy`)
				.default;

		const npyArray = await n.load(npyFile);
		console.log(npyArray);

		// axial seems to be in fortran order while the other two are in C order
		let ndArray;
		if (currentPlane === "axial") {
			// initialise the ndarray with a stride that conforms to C contiguity
			// this is done by editing the stride
			// original Fortran contiguity stride = [448, 1] (which is the same as stride = [data.shape[1], 1])
			// transforming this stride to C contiguous = [1, 224] (which is the same as stride = [1, data.shape[0]])
			// this allows us to access array indexes correctly
			// for more info see https://ajcr.net/stride-guide-part-2/
			ndArray = ndarray(
				npyArray.data,
				npyArray.shape,
				[1, npyArray.shape[0]],
				npyArray.offset
			);
			console.log(ndArray);
		} else {
			ndArray = ndarray(npyArray.data, npyArray.shape);
		}

		console.log("plane: " + currentPlane);
		console.log("slice: " + paddedSlice);
		console.log(ndArray.shape);
		console.log(mouseX, mouseY);
		console.log(ndArray.get(mouseX, mouseY));

		const currentBlock = ndArray.get(mouseX, mouseY);

		return currentBlock;
	};

	const calculateMriImageCoords = (
		currentPlane,
		currentSlice,
		axisX,
		axisY,
		axisZ
	) => {
		let newMriCoords;

		switch (currentPlane) {
			case "sagittal":
				newMriCoords = {
					sagittal: {
						slice: currentSlice,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisZ,
						mouseY: axisX,
					},
					coronal: {
						slice: axisX,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisZ * CORONAL_RESCALING_FACTOR,
						mouseY: currentSlice * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: axisZ,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisX,
						mouseY: currentSlice,
					},
				};
				break;
			case "coronal":
				// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
				axisY = (axisY / CORONAL_RESCALING_FACTOR).toFixed(0);
				axisZ = (axisZ / CORONAL_RESCALING_FACTOR).toFixed(0);

				newMriCoords = {
					sagittal: {
						slice: axisY,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisZ,
						mouseY: currentSlice,
					},
					coronal: {
						slice: currentSlice,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisZ * CORONAL_RESCALING_FACTOR,
						mouseY: axisY * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: axisZ,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: currentSlice,
						mouseY: axisY,
					},
				};
				break;
			case "axial":
				newMriCoords = {
					sagittal: {
						slice: axisY,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: currentSlice,
						mouseY: axisX,
					},
					coronal: {
						slice: axisX,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: currentSlice * CORONAL_RESCALING_FACTOR,
						mouseY: axisY * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: currentSlice,
						axisX: axisX,
						axisY: axisY,
						axisZ: axisZ,
						mouseX: axisX,
						mouseY: axisY,
					},
				};
				break;
		}

		return newMriCoords;
	};

	if (mriImageCoords === null) {
		return <div>Could not build the atlas. No MRI images found.</div>;
	}

	return (
		<section className="atlas-imgs-container">
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriImages
				plane="sagittal"
				mriImageCoords={mriImageCoords}
				updateAtlasImages={updateAtlasImages}
			/>
			<MriImages
				plane="coronal"
				mriImageCoords={mriImageCoords}
				updateAtlasImages={updateAtlasImages}
				coronalRescalingFactor={CORONAL_RESCALING_FACTOR}
			/>
			<MriImages
				plane="axial"
				mriImageCoords={mriImageCoords}
				updateAtlasImages={updateAtlasImages}
			/>

			<HistologyImage histologyImageCoords={histologyImageCoords} />

			<div className="scrollbar"></div>
		</section>
	);
};

export default AtlasImages;
