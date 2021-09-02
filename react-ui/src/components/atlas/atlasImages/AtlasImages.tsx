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

import { CurrentLabel } from "../../../models/label.model";
import { MriCoords } from "../../../models/mriCoords.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./AtlasImages.css";

interface Props {
	channel: string;
	showHiRes: boolean;
	showLabels: boolean;
	labelsTransparency: string;
	setCurrentLabel: (currentLabel: CurrentLabel) => void;
}

// const initMriCoords = {
// 	sagittal: {
// 		slice: 10,
// 		mouseX: 10,
// 		mouseY: 10,
// 	},
// 	coronal: {
// 		slice: 10,
// 		mouseX: 10,
// 		mouseY: 10,
// 	},
// 	axial: {
// 		slice: 10,
// 		mouseX: 10,
// 		mouseY: 10,
// 	},
// };

const AtlasImages: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mriImageCoords, setMriImageCoords] = useState<MriCoords | null>(null);
	const [histologyImageCoords, setHistologyImageCoords] =
		useState<HistologyCoords | null>(null);

	const {
		channel,
		showHiRes,
		showLabels,
		labelsTransparency,
		setCurrentLabel,
	} = props;

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
				type
			);

			setCurrentLabel(currentLabel);
		},
		[setCurrentLabel]
	);

	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// args: plane, slice, mouseX, mouseY
				// argument order is different for other planes
				await updateAtlasImages("axial", 144, 97, 198);
			} catch {
				setError("error building atlas");
			}
			setIsLoading(false);
		};

		buildAtlas();
	}, []);

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

	const updateAtlasImages = async (
		currentPlane: string,
		currentSlice: number,
		mouseX: number,
		mouseY: number
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
			newMriCoords!
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
			"histology"
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
			Number((mriCoordinatesKey.axial.width - resultX).toFixed(0)),
			Number((mriCoordinatesKey.axial.height - resultY).toFixed(0))
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
		<div className="atlas-imgs-container">
			<ErrorModal error={error} onClear={() => setError(null)} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriImages
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				updateAtlasImages={updateAtlasImages}
			/>

			<HistologyImage
				histologyImageCoords={histologyImageCoords}
				channel={channel}
				showHiRes={showHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				histologyToMri={histologyToMri}
			/>
		</div>
	);
};

export default AtlasImages;
