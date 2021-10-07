import { FC, useState, useEffect, useCallback } from "react";

import calculateMriImageCoords from "../../utils/calculateMriImageCoords";
import calculateHistologyImageCoords from "../../utils/calculateHistologyImageCoords";
import calculateAdjustedMriCoords from "../../utils/calculateAdjustedMriCoords";
import logMriCoordsForDebugging from "../../utils/logMriCoordsForDebugging";
import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriImages from "./MriImages";
import HistologyImage from "./HistologyImage";
import getMatrix from "../../utils/getMatrix";
import matrixMultiplier from "../../utils/matrixMultiplier";
import histologyLabelParser from "../../utils/histologyLabelParser";
import Scrollbars from "../scrollbars/Scrollbars";

import { CurrentLabel } from "../../../models/label.model";
import { MriCoords } from "../../../models/mriCoords.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";
import { Centroid } from "../../../models/centroid.model";

import "./AtlasImages.css";

interface Props {
	baseAssetsUrl: string;
	patientId: string;
	channel: string;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	showLabels: boolean;
	labelsTransparency: string;
	setCurrentLabel: (currentLabel: CurrentLabel | null) => void;
	centroid: Centroid | null;
}

const AtlasImages: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState<MriCoords | null>(null);
	const [histologyImageCoords, setHistologyImageCoords] =
		useState<HistologyCoords | null>(null);

	const {
		baseAssetsUrl,
		patientId,
		channel,
		showHiRes,
		setShowHiRes,
		showLabels,
		labelsTransparency,
		setCurrentLabel,
		centroid,
	} = props;

	const updateAtlasImages = async (
		currentMriPlane: string,
		currentMriSlice: number,
		currentMriMouseX: number,
		currentMriMouseY: number,
		patientId: string
	) => {
		console.log("----------");
		console.log("BUILDING IMAGES");

		const { adjustedMriSlice, adjustedMriMouseX, adjustedMriMouseY } =
			calculateAdjustedMriCoords(
				currentMriPlane,
				currentMriSlice,
				currentMriMouseX,
				currentMriMouseY
			);

		logMriCoordsForDebugging(
			currentMriPlane,
			currentMriSlice,
			currentMriMouseX,
			currentMriMouseY,
			adjustedMriSlice!,
			adjustedMriMouseX!,
			adjustedMriMouseY!
		);

		const newMriCoords = calculateMriImageCoords(
			currentMriPlane,
			currentMriSlice,
			currentMriMouseX,
			currentMriMouseY,
			adjustedMriSlice!,
			adjustedMriMouseX!,
			adjustedMriMouseY!
		);

		setMriImageCoords(newMriCoords!); // refactor this to check that the mriImage is valid

		const newHistologyCoords = await calculateHistologyImageCoords(
			currentMriPlane,
			currentMriSlice,
			currentMriMouseX,
			currentMriMouseY,
			adjustedMriSlice!,
			adjustedMriMouseX!,
			adjustedMriMouseY!,
			newMriCoords!,
			patientId,
			baseAssetsUrl
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

		setHistologyImageCoords(newHistologyCoords);
	};

	const setCurrentLabelHandler = useCallback(
		async (
			currentHistologyMouseX: number,
			currentHistologyMouseY: number,
			histologyImageCoords: HistologyCoords,
			type: string
		) => {
			setCurrentLabel(null);

			const currentLabel = await histologyLabelParser(
				currentHistologyMouseX,
				currentHistologyMouseY,
				histologyImageCoords,
				type,
				patientId,
				baseAssetsUrl
			);

			setCurrentLabel(currentLabel);
		},
		[setCurrentLabel, patientId, baseAssetsUrl]
	);

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// args: plane, slice, currentMriMouseX, currentMriMouseY
				// I should pass the argument as an object to make it more clear
				await updateAtlasImages("axial", 124, 149, 357, patientId);
			} catch {
				setError("error building atlas");
			}
			setIsLoading(false);
		};

		buildAtlas();
	}, [patientId]);

	// needs refactoring
	useEffect(() => {
		const type = showHiRes ? "hiRes" : "lowRes";

		// why am I passing both histologyImageCoords and the embedded mouseX and mouseY?
		// I should just pass histologyImageCoords
		if (histologyImageCoords !== null && mriImageCoords !== null) {
			if (!showHiRes) {
				setCurrentLabelHandler(
					histologyImageCoords.coordsLowRes.mouseX,
					histologyImageCoords.coordsLowRes.mouseY,
					histologyImageCoords,
					type
				);
			}

			if (showHiRes) {
				setCurrentLabelHandler(
					histologyImageCoords.coordsHiRes.mouseX,
					histologyImageCoords.coordsHiRes.mouseY,
					histologyImageCoords,
					type
				);
			}
		}
	}, [histologyImageCoords, mriImageCoords, setCurrentLabelHandler]);

	useEffect(() => {
		if (centroid != null) {
			const resultX = centroid.resultX;
			const resultY = centroid.resultY;
			const resultZ = centroid.resultZ;

			updateAtlasImages(
				"axial",
				Number(resultZ.toFixed(0)),
				Number((+mriCoordinatesKey.axial.width - resultX).toFixed(0)),
				Number((+mriCoordinatesKey.axial.height - resultY).toFixed(0)),
				patientId
			);
		}
	}, [centroid, patientId]);

	const histologyToMri = async (
		currentMriMouseX: number,
		currentMriMouseY: number
	) => {
		console.log("getting coordinates from histology to mri");

		const histologyFolder = showHiRes ? "histology_hr" : "histology";

		const matrix = await getMatrix(
			histologyImageCoords!.currentHistologyBlock,
			histologyFolder,
			patientId,
			baseAssetsUrl
		);

		const coords = matrixMultiplier(matrix, [
			currentMriMouseY,
			currentMriMouseX,
			Number(histologyImageCoords!.currentHistologySlice),
			1,
		]);

		const { resultX, resultY, resultZ } = coords;

		// axial is picked arbitrarily here
		// it could be any of the planes as long as the order of params is entered correctly
		updateAtlasImages(
			"axial",
			Number(resultZ.toFixed(0)),
			Number((+mriCoordinatesKey.axial.width - resultX).toFixed(0)),
			Number((+mriCoordinatesKey.axial.height - resultY).toFixed(0)),
			patientId
		);
	};

	const adjustHistologyCoordsFromScrollbar = async (newSliceNumber: number) => {
		const matrix = await getMatrix(
			histologyImageCoords!.currentHistologyBlock,
			"histology",
			patientId,
			baseAssetsUrl
		);

		const coords = matrixMultiplier(matrix, [
			histologyImageCoords!.coordsLowRes.mouseY,
			histologyImageCoords!.coordsLowRes.mouseX,
			+newSliceNumber.toFixed(0),
			1,
		]);

		const { resultX, resultY, resultZ } = coords;

		// axial is picked arbitrarily here, it could be any of the planes
		updateAtlasImages(
			"axial",
			Number(resultZ.toFixed(0)),
			Number((+mriCoordinatesKey.axial.width - resultX).toFixed(0)),
			Number((+mriCoordinatesKey.axial.height - resultY).toFixed(0)),
			patientId
		);
	};

	if (mriImageCoords === null || histologyImageCoords === null) {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div>Builing atlas, please wait...</div>
			</>
		);
	}

	return (
		<div className="atlas-imgs-container">
			<ErrorModal error={error} onClear={() => setError(null)} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriImages
				baseAssetsUrl={baseAssetsUrl}
				patientId={patientId}
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				updateAtlasImages={updateAtlasImages}
			/>

			<HistologyImage
				baseAssetsUrl={baseAssetsUrl}
				patientId={patientId}
				histologyImageCoords={histologyImageCoords}
				channel={channel}
				showHiRes={showHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				histologyToMri={histologyToMri}
			/>

			<Scrollbars
				histologyImageCoords={histologyImageCoords}
				adjustHistologyCoordsFromScrollbar={adjustHistologyCoordsFromScrollbar}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
			/>
		</div>
	);
};

export default AtlasImages;
