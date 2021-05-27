import React, { useState, useEffect } from "react";
import ndarray from "ndarray";

import npyjs from "../../utils/npy";
import readTxt from "../../utils/readTxt";

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

	const multiplyMatrixAndPoint = (matrix, point) => {
		// Give a variable name to each part of the matrix, a column and row number
		let c0r0 = matrix[0],
			c1r0 = matrix[1],
			c2r0 = matrix[2],
			c3r0 = matrix[3];
		let c0r1 = matrix[4],
			c1r1 = matrix[5],
			c2r1 = matrix[6],
			c3r1 = matrix[7];
		let c0r2 = matrix[8],
			c1r2 = matrix[9],
			c2r2 = matrix[10],
			c3r2 = matrix[11];
		let c0r3 = matrix[12],
			c1r3 = matrix[13],
			c2r3 = matrix[14],
			c3r3 = matrix[15];

		// set some names for the point
		let x = point[0];
		let y = point[1];
		let z = point[2];
		let w = point[3];

		// perform matrix multiplication operations
		// for a worked example of matrix multiplication see https://matrix.reshish.com/multCalculation.php
		let resultX = x * c0r0 + y * c1r0 + z * c2r0 + w * c3r0;
		let resultY = x * c0r1 + y * c1r1 + z * c2r1 + w * c3r1;
		let resultZ = x * c0r2 + y * c1r2 + z * c2r2 + w * c3r2;
		let resultW = x * c0r3 + y * c1r3 + z * c2r3 + w * c3r3;

		return [resultX, resultY, resultZ, resultW];
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

		const matrix = await getCurrentMatrix(currentBlock);
		if (matrix === undefined) {
			return;
		}
		console.log(matrix);

		let result = multiplyMatrixAndPoint(matrix, [
			mouseX,
			mouseY,
			currentSlice + 1,
			1,
		]);

		console.log(result, currentBlock);
		return { coords: result, currentBlock: currentBlock };
	};

	const getCurrentMatrix = async (currentBlock) => {
		if (currentBlock === 0) {
			console.log("block returned 0");
			return;
		}

		let read = new readTxt();

		const paddedBlock = currentBlock.toString().padStart(2, 0);
		console.log(paddedBlock);

		const txtFile =
			await require(`../../../assets/P57-16/mri/matrices/block_${paddedBlock}.txt`)
				.default;

		const txtArray = await read.load2(txtFile);

		return txtArray;
	};

	const getCurrentBlock = async (
		currentPlane,
		currentSlice,
		mouseX,
		mouseY
	) => {
		let n = new npyjs();
		let block;

		const paddedSlice = currentSlice.toString().padStart(3, 0);

		const npyFile =
			await require(`../../../assets/P57-16/mri/indices_${currentPlane}/slice_${paddedSlice}.npy`)
				.default;

		const npyArray = await n.load(npyFile);
		console.log(npyArray);

		var testArray = ndarray(npyArray.data, npyArray.shape);

		// initialise the ndarray with a stride that conforms to C contiguity
		// this is done by editing the stride
		// original Fortran contiguity stride = [448, 1] (which is the same as stride = [data.shape[1], 1])
		// transforming this stride to C contiguous = [1, 224] (which is the same as stride = [1, data.shape[0]])
		// this allows us to access array indexes correctly
		// for more info see https://ajcr.net/stride-guide-part-2/
		var reversedStride = ndarray(
			npyArray.data,
			npyArray.shape,
			[1, npyArray.shape[0]],
			npyArray.offset
		);
		console.log(reversedStride);

		console.log(currentPlane);
		console.log(currentSlice);
		console.log(reversedStride.shape);
		console.log(mouseX, mouseY);
		console.log(reversedStride.get(mouseX, mouseY));

		const currentBlock = reversedStride.get(mouseX, mouseY);

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
