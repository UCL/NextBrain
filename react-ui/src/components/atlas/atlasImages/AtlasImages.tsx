import { FC, useState, useEffect, useCallback } from "react";

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
import histologyLabelParser from "../../utils/histologyLabelParser";
import Scrollbars from "../scrollbars/Scrollbars";

import { CurrentLabel } from "../../../models/label.model";
import { MriCoords } from "../../../models/mriCoords.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./AtlasImages.css";

interface Props {
	patientId: string;
	channel: string;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	showLabels: boolean;
	labelsTransparency: string;
	setCurrentLabel: (currentLabel: CurrentLabel) => void;
	centroid: any;
}

const AtlasImages: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState<MriCoords | null>(null);
	const [histologyImageCoords, setHistologyImageCoords] =
		useState<HistologyCoords | null>(null);

	const {
		patientId,
		channel,
		showHiRes,
		setShowHiRes,
		showLabels,
		labelsTransparency,
		setCurrentLabel,
		centroid,
	} = props;

	console.log(centroid);

	const setCurrentLabelHandler = useCallback(
		async (
			mouseX: number,
			mouseY: number,
			histologyImageCoords: HistologyCoords,
			type: string
		) => {
			console.log("getting current histology label");

			//const { mouseX, mouseY } = getMouseCoords(e);

			const currentLabel = await histologyLabelParser(
				mouseX,
				mouseY,
				histologyImageCoords,
				type,
				patientId
			);

			setCurrentLabel(currentLabel);
		},
		[setCurrentLabel, patientId]
	);

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// args: plane, slice, mouseX, mouseY
				// I should pass the argument as an object to make it more clear
				await updateAtlasImages("axial", 194, 97, 131, patientId);
			} catch {
				setError("error building atlas");
			}
			setIsLoading(false);
		};

		buildAtlas();
	}, [patientId]);

	useEffect(() => {
		if (histologyImageCoords !== null && mriImageCoords !== null) {
			setCurrentLabelHandler(
				histologyImageCoords.coords.mouseX,
				histologyImageCoords.coords.mouseY,
				histologyImageCoords,
				"lowRes"
			);
		}
	}, [histologyImageCoords, mriImageCoords, setCurrentLabelHandler]);

	useEffect(() => {
		console.log(centroid);
		if (centroid !== null && centroid !== undefined) {
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

	const updateAtlasImages = async (
		currentPlane: string,
		currentSlice: number,
		mouseX: number,
		mouseY: number,
		patientId: string
	) => {
		console.log("----------");
		console.log("BUILDING IMAGES");

		console.log(currentPlane, currentSlice, mouseX, mouseY);

		const { adjustedSlice, adjustedMouseX, adjustedMouseY } =
			calculateAdjustedMouseCoords(currentPlane, currentSlice, mouseX, mouseY);

		logCoordsForDebugging(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice!,
			adjustedMouseX!,
			adjustedMouseY!
		);

		const newMriCoords = calculateMriImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice!,
			adjustedMouseX!,
			adjustedMouseY!
		);

		const newHistologyCoords = await calculateHistologyImageCoords(
			currentPlane,
			currentSlice,
			mouseX,
			mouseY,
			adjustedSlice!,
			adjustedMouseX!,
			adjustedMouseY!,
			newMriCoords!,
			patientId
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

		setMriImageCoords(newMriCoords!); // refactor this to check that the mriImage is valid
		setHistologyImageCoords(newHistologyCoords);
	};

	const histologyToMri = async (e: React.MouseEvent) => {
		console.log("getting coordinates from histology to mri");

		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);

		const matrix = await getMatrix(
			histologyImageCoords!.currentBlock,
			"histology",
			patientId
		);

		const coords = matrixMultiplier(matrix, [
			mouseY,
			mouseX,
			Number(histologyImageCoords!.coords.slice),
			1,
		]);

		const { resultX, resultY, resultZ } = coords;

		console.log(coords);

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
		console.log(mriImageCoords);
		console.log(histologyImageCoords);

		const matrix = await getMatrix(
			histologyImageCoords!.currentBlock,
			"histology",
			patientId
		);

		const coords = matrixMultiplier(matrix, [
			histologyImageCoords!.coords.mouseY,
			histologyImageCoords!.coords.mouseX,
			+newSliceNumber.toFixed(0),
			1,
		]);

		const { resultX, resultY, resultZ } = coords;

		console.log(coords);

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

	const adjustMriCoordsFromScrollbar = async (
		newSliceNumber: number,
		plane: string
	) => {
		console.log(plane);
		console.log(newSliceNumber);
		console.log(mriImageCoords);
		console.log(histologyImageCoords);

		updateAtlasImages(
			plane,
			Number(+newSliceNumber.toFixed(0)),
			Number(mriImageCoords![plane].mouseX),
			Number(mriImageCoords![plane].mouseY),
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
				patientId={patientId}
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				updateAtlasImages={updateAtlasImages}
			/>

			<HistologyImage
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
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
			/>
		</div>
	);
};

export default AtlasImages;
