import { FC, useState, useEffect, useCallback } from "react";

import calculateMriImageCoords from "../../utils/calculateMriImageCoords";
import calculateHistologyImageCoords from "../../utils/calculateHistologyImageCoords";
import calculateAdjustedMriCoords from "../../utils/calculateAdjustedMriCoords";
import logMriCoordsForDebugging from "../../utils/logMriCoordsForDebugging";
import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriImages from "./MriImages";
import HistologyImages from "./HistologyImages";
import getMatrix from "../../utils/getMatrix";
import matrixMultiplier from "../../utils/matrixMultiplier";
import histologyLabelParser from "../../utils/histologyLabelParser";
import Scrollbars from "../scrollbars/Scrollbars";

import { CurrentLabel } from "../../../models/label.model";
import { MriCoords } from "../../../models/mriCoords.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";
import { NavPanelCoords } from "../../../models/navPanelCoords.model";
import { AtlasImagesDimensionsKey } from "../../../models/atlasImagesDimensionsKey.model";

import "./AtlasImages.css";

interface Props {
	patientId: string;
	channel: string;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	showLabels: boolean;
	labelsTransparency: string;
	setCurrentLabel: (currentLabel: CurrentLabel | null) => void;
	navPanelCoords: NavPanelCoords | null;
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null;
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
		navPanelCoords,
		atlasImagesDimensionsKey,
	} = props;

	const updateMriAndHistologyImages = async (
		currentMriPlane: string,
		currentMriSlice: number,
		currentMriMouseX: number,
		currentMriMouseY: number,
		patientId: string
	) => {
		// user is navigating within an mri image
		// function updates mri image coords and then calculates new histology coords

		const newMriCoords = updateMriImagesHandler(
			currentMriPlane,
			currentMriSlice,
			currentMriMouseX,
			currentMriMouseY
		);

		updateHistologyImagesHandler(currentMriPlane, newMriCoords!, patientId);
	};

	const updateHistologyImagesHandler = async (
		currentMriPlane: string,
		newMriCoords: MriCoords,
		patientId: string
	) => {
		const newHistologyCoords = await calculateHistologyImageCoords(
			currentMriPlane,
			newMriCoords!,
			patientId,
			atlasImagesDimensionsKey
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

	const updateMriImagesHandler = (
		currentMriPlane: string,
		currentMriSlice: number,
		currentMriMouseX: number,
		currentMriMouseY: number
	) => {
		console.log("BUILDING MRI IMAGES");

		const { adjustedMriSlice, adjustedMriMouseX, adjustedMriMouseY } =
			calculateAdjustedMriCoords(
				currentMriPlane,
				currentMriSlice,
				currentMriMouseX,
				currentMriMouseY,
				atlasImagesDimensionsKey
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

		return newMriCoords;
	};

	const setCurrentLabelHandler = useCallback(
		async (
			currentHistologyMouseX: number,
			currentHistologyMouseY: number,
			histologyImageCoords: HistologyCoords,
			type: string
		) => {
			// loading spinner shows while the label is loading
			setCurrentLabel(null);

			const currentLabel = await histologyLabelParser(
				currentHistologyMouseX,
				currentHistologyMouseY,
				histologyImageCoords,
				type,
				patientId
			);

			setCurrentLabel(currentLabel);
		},
		[setCurrentLabel, patientId]
	);

	// initialize mri panels based on an arbitrary starting point
	useEffect(() => {
		const buildAtlas = async () => {
			setIsLoading(true);
			try {
				// args: plane, slice, currentMriMouseX, currentMriMouseY
				// I should pass the argument as an object to make it more clear
				await updateMriAndHistologyImages("axial", 124, 149, 357, patientId);
			} catch {
				setError("error building atlas");
			}
			setIsLoading(false);
		};

		buildAtlas();
	}, [patientId]);

	// sets the current label every time new coords are detected
	// needs refactoring
	useEffect(() => {
		const type = showHiRes ? "hiRes" : "lowRes";

		// why am I passing both histologyImageCoords and the embedded mouseX and mouseY?
		// I should just pass histologyImageCoords
		if (histologyImageCoords !== null && mriImageCoords !== null) {
			if (!showHiRes) {
				console.log(histologyImageCoords);

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
	}, [histologyImageCoords, mriImageCoords, setCurrentLabelHandler, showHiRes]);

	// sets the mri and histology coords when navigating from the drop-down list
	useEffect(() => {
		if (navPanelCoords != null) {
			const resultX = navPanelCoords.resultX;
			const resultY = navPanelCoords.resultY;
			const resultZ = navPanelCoords.resultZ;

			updateMriAndHistologyImages(
				"axial",
				+resultZ.toFixed(0),
				+atlasImagesDimensionsKey!.mriDimensions.axial.width -
					+resultX.toFixed(0),
				+atlasImagesDimensionsKey!.mriDimensions.axial.height -
					+resultY.toFixed(0),
				patientId
			);
		}
	}, [navPanelCoords, patientId, atlasImagesDimensionsKey]);

	const histologyToMri = async (
		currentHistologyMouseX: number,
		currentHistologyMouseY: number
	) => {
		// first we calculate new mri coords based on the current histology coords
		// then below we set the current histology coords based on the mouseX and mouseY positions

		const histologyFolder = showHiRes ? "histology_hr" : "histology";

		const matrix = await getMatrix(
			histologyImageCoords!.currentHistologyBlock,
			histologyFolder,
			patientId
		);

		const singleMriCoord = matrixMultiplier(matrix, [
			currentHistologyMouseY,
			currentHistologyMouseX,
			histologyImageCoords!.currentHistologySlice,
			1,
		]);

		const { resultX, resultY, resultZ } = singleMriCoord;

		updateMriImagesHandler(
			"axial",
			+resultZ.toFixed(0),
			+atlasImagesDimensionsKey!.mriDimensions.axial.width -
				+resultX.toFixed(0),
			+atlasImagesDimensionsKey!.mriDimensions.axial.height -
				+resultY.toFixed(0)
		);

		// calculate new histology coords
		const newHistologyCoords = { ...histologyImageCoords };

		const currentHistologyBlock = histologyImageCoords!.currentHistologySlice;

		// initialise variables to avoid typescript errors
		// is there a more correct way of doing this?
		let lowResMouseX = 0;
		let lowResMouseY = 0;
		let hiResMouseX = 0;
		let hiResMouseY = 0;

		// we need to calculate the coords for both hi and low res
		// when scaling between hi and low res, the result seems to be always about 10px off
		// look into why this might be
		// possibly outsource this into a standalone module for reuse

		// calculate low-res mouse position from current hi-res mouse coord
		if (showHiRes) {
			lowResMouseX =
				(+atlasImagesDimensionsKey!.histologyLowResDimensions[
					currentHistologyBlock
				].width /
					+atlasImagesDimensionsKey!.histologyHiResDimensions[
						currentHistologyBlock
					].width) *
				currentHistologyMouseX;

			lowResMouseY =
				(+atlasImagesDimensionsKey!.histologyLowResDimensions[
					currentHistologyBlock
				].height /
					+atlasImagesDimensionsKey!.histologyHiResDimensions[
						currentHistologyBlock
					].height) *
				currentHistologyMouseY;
		}

		// calculate hi-res mouse position from current low-res mouse coord
		if (!showHiRes) {
			hiResMouseX =
				(+atlasImagesDimensionsKey!.histologyHiResDimensions[
					currentHistologyBlock
				].width /
					+atlasImagesDimensionsKey!.histologyLowResDimensions[
						currentHistologyBlock
					].width) *
				currentHistologyMouseX;

			hiResMouseY =
				(+atlasImagesDimensionsKey!.histologyHiResDimensions[
					currentHistologyBlock
				].height /
					+atlasImagesDimensionsKey!.histologyLowResDimensions[
						currentHistologyBlock
					].height) *
				currentHistologyMouseY;
		}

		// assign new mouse coords for both low and hi res
		if (showHiRes) {
			newHistologyCoords.coordsHiRes!.mouseX = currentHistologyMouseX;
			newHistologyCoords.coordsHiRes!.mouseY = currentHistologyMouseY;

			newHistologyCoords.coordsLowRes!.mouseX = +lowResMouseX;
			newHistologyCoords.coordsLowRes!.mouseY = +lowResMouseY;
		} else {
			newHistologyCoords.coordsLowRes!.mouseX = currentHistologyMouseX;
			newHistologyCoords.coordsLowRes!.mouseY = currentHistologyMouseY;

			newHistologyCoords.coordsHiRes!.mouseX = +hiResMouseX;
			newHistologyCoords.coordsHiRes!.mouseY = +hiResMouseY;
		}

		setHistologyImageCoords(newHistologyCoords as HistologyCoords);
	};

	const adjustHistologyCoordsFromScrollbar = async (newSliceNumber: number) => {
		const matrix = await getMatrix(
			histologyImageCoords!.currentHistologyBlock,
			"histology",
			patientId
		);

		const singleMriCoord = matrixMultiplier(matrix, [
			histologyImageCoords!.coordsLowRes.mouseY,
			histologyImageCoords!.coordsLowRes.mouseX,
			+newSliceNumber.toFixed(0),
			1,
		]);

		const { resultX, resultY, resultZ } = singleMriCoord;

		updateMriImagesHandler(
			"axial",
			+resultZ.toFixed(0),
			+atlasImagesDimensionsKey!.mriDimensions.axial.width -
				+resultX.toFixed(0),
			+atlasImagesDimensionsKey!.mriDimensions.axial.height -
				+resultY.toFixed(0)
		);

		const newHistologyCoords = { ...histologyImageCoords };
		newHistologyCoords.currentHistologySlice = +newSliceNumber.toFixed(0);

		setHistologyImageCoords(newHistologyCoords as HistologyCoords);
	};

	if (mriImageCoords == null || histologyImageCoords == null) {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && <LoadingSpinner asOverlay message={"Loading..."} />}
				<div>Builing atlas, please wait...</div>
			</>
		);
	}

	return (
		<div className="atlas-imgs-container">
			<ErrorModal error={error} onClear={() => setError(null)} />
			{isLoading && <LoadingSpinner asOverlay message={"Loading..."} />}

			<MriImages
				patientId={patientId}
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				updateMriAndHistologyImages={updateMriAndHistologyImages}
				atlasImagesDimensionsKey={atlasImagesDimensionsKey}
			/>

			<HistologyImages
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
				atlasImagesDimensionsKey={atlasImagesDimensionsKey}
			/>
		</div>
	);
};

export default AtlasImages;
