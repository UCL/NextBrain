import React, { useState, useEffect } from "react";

import calculateMriImageCoords from "../../utils/calculateMriImageCoords";
import calculateHistologyImageCoords from "../../utils/calculateHistologyImageCoords";
import calculateAdjustedMouseCoords from "../../utils/calculateAdjustedMouseCoords";
import logCoordsForDebugging from "../../utils/logCoordsForDebugging";

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
			// plane, slice, mouseX, mouseY
			updateAtlasImages("axial", 195, 158, 144);
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
		console.log("----------");
		console.log("BUILDING IMAGES");

		const { adjustedSlice, adjustedMouseX, adjustedMouseY } =
			calculateAdjustedMouseCoords(currentPlane, currentSlice, mouseX, mouseY);

		logCoordsForDebugging(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice,
			adjustedMouseX,
			adjustedMouseY
		);

		const newMriCoords = calculateMriImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice,
			adjustedMouseX,
			adjustedMouseY
		);

		const newHistologyCoords = await calculateHistologyImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice,
			adjustedMouseX,
			adjustedMouseY,
			newMriCoords
		);
		//console.log(newHistologyCoords);

		setMriImageCoords(newMriCoords);
		setHistologyImageCoords(newHistologyCoords);
	};

	const histologyToMri = (e) => {
		console.log("histology to mri");

		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);
	};

	const getMouseCoords = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;

		return { mouseX, mouseY };
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
				getMouseCoords={getMouseCoords}
			/>
			<MriImages
				plane="coronal"
				mriImageCoords={mriImageCoords}
				updateAtlasImages={updateAtlasImages}
				getMouseCoords={getMouseCoords}
				coronalRescalingFactor={CORONAL_RESCALING_FACTOR}
			/>
			<MriImages
				plane="axial"
				mriImageCoords={mriImageCoords}
				getMouseCoords={getMouseCoords}
				updateAtlasImages={updateAtlasImages}
			/>

			<HistologyImage
				histologyImageCoords={histologyImageCoords}
				histologyToMri={histologyToMri}
				getMouseCoords={getMouseCoords}
			/>

			<div className="scrollbar"></div>
		</section>
	);
};

export default AtlasImages;
