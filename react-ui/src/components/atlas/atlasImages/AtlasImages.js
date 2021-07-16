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
import matrixMultiplier from "../../utils/matrixMultiplier";

import CORONAL_RESCALING_FACTOR from "../../utils/CoronalRescalingFactor";

import "./AtlasImages.css";

const AtlasImages = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState(null);
	const [histologyImageCoords, setHistologyImageCoords] = useState(null);

	const { channel } = props;

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// plane, slice, mouseX, mouseY
				await updateAtlasImages("axial", 195, 158, 144);
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
		console.log(newHistologyCoords);

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
		console.log("histology to mri");

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

	const getMouseCoords = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;

		return { mouseX, mouseY };
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
				channel={channel}
				histologyToMri={histologyToMri}
				getMouseCoords={getMouseCoords}
			/>
		</section>
	);
};

export default AtlasImages;
