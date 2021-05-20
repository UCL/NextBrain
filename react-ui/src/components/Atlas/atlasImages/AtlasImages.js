import React, { useState, useEffect } from "react";
import ndarray from "ndarray";

import npyjs from "../../utils/npy";

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

	const updateAtlasImages = (
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
		const newHistologyCoords = calculateHistologyImageCoords(
			currentPlane,
			currentSlice,
			axisX,
			axisY,
			axisZ,
			mouseX,
			mouseY
		);

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

		n.ajax(npyFile, (npyArray) => {
			console.log(npyArray);

			const sliceIndices = ndarray(npyArray.data, npyArray.shape);
			block = sliceIndices.get(mouseX, mouseY);
			console.log(block);
		});
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

			<HistologyImage />

			<div className="scrollbar"></div>
		</section>
	);
};

export default AtlasImages;
