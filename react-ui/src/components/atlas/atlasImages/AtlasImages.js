import React, { useState, useEffect } from "react";

import calculateMriImageCoords from "../../utils/calculateMriImageCoords";
import calculateHistologyImageCoords from "../../utils/calculateHistologyImageCoords";
import calculateAdjustedMouseCoords from "../../utils/calculateAdjustedMouseCoords";
import logCoordsForDebugging from "../../utils/logCoordsForDebugging";
import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriImages from "./MriImages";
import HistologyImage from "./HistologyImage";
import getMatrix from "../../utils/getMatrix";
import getMouseCoords from "../../utils/getmouseCoords";
import matrixMultiplier from "../../utils/matrixMultiplier";

import CORONAL_RESCALING_FACTOR from "../../utils/CoronalRescalingFactor";

import "./AtlasImages.css";

const AtlasImages = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState(null);
	const [histologyImageCoords, setHistologyImageCoords] = useState(null);

	const {
		channel,
		showHiRes,
		showLabels,
		labelsTransparency,
		setCurrentLabel,
	} = props;

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// plane, slice, mouseX, mouseY
				await updateAtlasImages("axial", 144, 97, 198);
			} catch {
				setError("error building atlas");
			}
			setIsLoading(false);
		};

		buildAtlas();
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
		console.log("histology image coords: ", newHistologyCoords);

		if (newHistologyCoords === "no block found") {
			setError("No block found for this coordinate");
			return;
		}

		if (newHistologyCoords === "no matrix found") {
			setError("No matrix found for this coordinate");
			return;
		}

		setMriImageCoords(newMriCoords);
		setHistologyImageCoords(newHistologyCoords);
	};

	const histologyToMri = async (e) => {
		console.log("getting coordinates from histology to mri");

		const { mouseX, mouseY } = getMouseCoords(e);

		const matrix = await getMatrix(
			histologyImageCoords.currentBlock,
			"histology"
		);

		const coords = matrixMultiplier(matrix, [
			mouseY,
			mouseX,
			histologyImageCoords.coords.slice,
			1,
		]);

		const { resultX, resultY, resultZ, resultW } = coords;

		console.log(coords);

		// axial is picked arbitrarily here
		// it could be any of the planes as long as the order of params is entered correctly
		updateAtlasImages(
			"axial",
			Number(resultZ.toFixed(0)),
			(mriCoordinatesKey.axial.width - resultX).toFixed(0),
			(mriCoordinatesKey.axial.height - resultY).toFixed(0)
		);
	};

	if (mriImageCoords === null) {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div>Builing atlas, please wait...</div>
			</>
		);
	}

	return (
		<section className="atlas-imgs-container">
			<ErrorModal error={error} onClear={() => setError(null)} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriImages
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				updateAtlasImages={updateAtlasImages}
				getMouseCoords={getMouseCoords}
			/>

			<HistologyImage
				histologyImageCoords={histologyImageCoords}
				channel={channel}
				showHiRes={showHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setCurrentLabel={setCurrentLabel}
				histologyToMri={histologyToMri}
				getMouseCoords={getMouseCoords}
			/>
		</section>
	);
};

export default AtlasImages;
