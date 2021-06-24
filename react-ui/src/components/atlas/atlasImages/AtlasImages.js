import React, { useState, useEffect } from "react";

import calculateMriImageCoords from "../../utils/calculateMriImageCoords";
import calculateHistologyImageCoords from "../../utils/calculateHistologyImageCoords";

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
		setIsLoading(true);

		try {
			updateAtlasImages("axial", 234, 55, 99);
			setIsLoading(false);
		} catch {
			setError("error building atlas");
		}
	}, []);

	const updateAtlasImages = async (
		currentPlane,
		currentSlice,
		mouseX,
		mouseY
	) => {
		console.log(mouseX, mouseY);
		const newMriCoords = calculateMriImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY
		);
		const newHistologyCoords = await calculateHistologyImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY
		);
		//console.log(newHistologyCoords);

		setMriImageCoords(newMriCoords);
		setHistologyImageCoords(newHistologyCoords);
	};

	if (mriImageCoords === null) {
		return (
			<>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div>Builing atlas, please wait...</div>
			</>
		);
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
