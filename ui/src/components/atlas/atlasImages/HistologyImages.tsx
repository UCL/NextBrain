import { FC, useState, useEffect, SyntheticEvent } from "react";

import { ASSETS_URL } from "../../utils/ASSETS_URL";
import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";
import getMouseCoords from "../../utils/getMouseCoords";
import HistologyLowResImage from "./HistologyLowResImage";
import HistologyLabelsImage from "./HistologyLabelsImage";
import HistologyHiResImage from "./HistologyHiResImage";

import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyImages.css";

interface Props {
	patientId: string;
	histologyImageCoords: HistologyCoords | null;
	showHiRes: boolean;
	showLabels: boolean;
	labelsTransparency: string;
	channel: string;
	histologyToMri: (mouseX: number, mouseY: number) => void;
}

const HistologyImages: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [histologyImage, setHistologyImage] = useState("");
	const [labelsImage, setLabelsImage] = useState("");
	const [imageDimensions, setImageDimensions] = useState<{
		[key: string]: number;
	} | null>(null);
	const [scaledHistologyMouseCoords, setScaledHistologyMouseCoords] = useState<{
		[key: string]: number;
	} | null>(null);

	const {
		patientId,
		histologyImageCoords,
		showHiRes,
		showLabels,
		labelsTransparency,
		channel,
		histologyToMri,
	} = props;

	useEffect(() => {
		const fetchHistologyImage = async () => {
			// determine the correct histology image based on computed coordinates
			if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
				const paddedBlock = histologyImageCoords["currentHistologyBlock"]
					.toString()
					.padStart(2, "0");

				const histologySlice = histologyImageCoords["currentHistologySlice"];
				const paddedSlice = histologySlice.toString().padStart(2, "0");

				const histologyFolder = showHiRes ? "histology_hr" : "histology";
				const histologyFileExtension = showHiRes ? "webp" : "jpg";
				const labelsFileExtension = showHiRes ? "webp" : "png";

				try {
					setIsLoading(true);

					const histologyImageUrl = `${ASSETS_URL}${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.${histologyFileExtension}`;
					const labelsImageUrl = `${ASSETS_URL}${patientId}/${histologyFolder}/${paddedBlock}/slices_labels/slice_${paddedSlice}.${labelsFileExtension}`;

					const histologyImageResponse = await fetch(histologyImageUrl);
					if (histologyImageResponse.ok) {
						const histologyImageBlob = await histologyImageResponse.blob();
						const histologyImageObjectURL =
							URL.createObjectURL(histologyImageBlob);

						setHistologyImage(histologyImageObjectURL);
					}

					const labelsImageResponse = await fetch(labelsImageUrl);
					if (labelsImageResponse.ok) {
						const labelsImageBlob = await labelsImageResponse.blob();
						const labelsImageObjectURL = URL.createObjectURL(labelsImageBlob);

						setLabelsImage(labelsImageObjectURL);
					}
				} catch (e) {
					setError("Error, could not load histology image");
					console.log(e);
				}
				setIsLoading(false);
			}
		};

		fetchHistologyImage();
	}, [histologyImageCoords, showHiRes, channel, patientId]);

	// take the current histology coords and calculate scaled mouseX and mouseY
	// this is to account for the fact that we scale the histology image with css using the max-height property
	useEffect(() => {
		if (imageDimensions !== null) {
			let currentHistologyMouseX = !showHiRes
				? histologyImageCoords!.coordsLowRes.mouseX
				: histologyImageCoords!.coordsHiRes.mouseX;

			let currentHistologyMouseY = !showHiRes
				? histologyImageCoords!.coordsLowRes.mouseY
				: histologyImageCoords!.coordsHiRes.mouseY;

			const { scaledHistologyMouseX, scaledHistologyMouseY } =
				calculateScaledHistologyMousePos(
					currentHistologyMouseX,
					currentHistologyMouseY,
					imageDimensions.naturalHeight,
					imageDimensions.naturalWidth,
					imageDimensions.scaledHeight,
					imageDimensions.scaledWidth
				);

			setScaledHistologyMouseCoords({
				mouseX: scaledHistologyMouseX,
				mouseY: scaledHistologyMouseY,
			});
		}
	}, [histologyImageCoords, imageDimensions, showHiRes]);

	const calculateScaledHistologyMousePos = (
		naturalCoordinateX: number,
		naturalCoordinateY: number,
		naturalHeight: number,
		naturalWidth: number,
		scaledHeight: number,
		scaledWidth: number
	) => {
		const scaledHistologyMouseX =
			(scaledWidth / naturalWidth) * naturalCoordinateX;

		const scaledHistologyMouseY =
			(scaledHeight / naturalHeight) * naturalCoordinateY;

		console.log(
			`scaled coord x: ${scaledHistologyMouseX}, scaled coord y: ${scaledHistologyMouseY}`
		);

		return { scaledHistologyMouseX, scaledHistologyMouseY };
	};

	// we need to store the image dimensions so that we can correctly calculate the mouse coordinates for scaled images
	// we store the image dimensions every time a new image gets loaded
	const onImageLoad = (e: SyntheticEvent) => {
		setIsLoading(false);

		const { naturalHeight, naturalWidth, scaledHeight, scaledWidth } =
			getImageDimensions(e);

		setImageDimensions({
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth,
		});
	};

	// called when user clicks on a lowRes or hiRes histology image
	const updateHistologyCoordsHandler = (e: SyntheticEvent | Event) => {
		const { naturalCoordinateX, naturalCoordinateY } = getHistologyMousePos(e);

		// update the atlas based on new histology coords
		histologyToMri(naturalCoordinateX, naturalCoordinateY);
	};

	const getHistologyMousePos = (e: SyntheticEvent | Event) => {
		const { mouseX, mouseY } = getMouseCoords(e, showHiRes);

		console.log("offsetX: " + mouseX, "offsetY: " + mouseY);

		const { naturalCoordinateX, naturalCoordinateY } =
			calculateNaturalMouseCoordinates(mouseX, mouseY);

		console.log(
			"naturalX: " + naturalCoordinateX,
			"naturalY: " + naturalCoordinateY
		);

		return { naturalCoordinateX, naturalCoordinateY };
	};

	const getImageDimensions = (e: any) => {
		const naturalWidth = e.target.naturalWidth; // the original size of the image
		const naturalHeight = e.target.naturalHeight;
		const scaledWidth = e.target.width; // the scaled size of the image
		const scaledHeight = e.target.height;

		return {
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth,
		};
	};

	// this function allows us to extract the natural x an y mouse coordinates
	// accounts for the fact that we set max-height css property on the histology image
	const calculateNaturalMouseCoordinates = (
		offsetX: number,
		offsetY: number
	) => {
		const naturalCoordinateX =
			(imageDimensions!.naturalWidth / imageDimensions!.scaledWidth) * offsetX;

		const naturalCoordinateY =
			(imageDimensions!.naturalHeight / imageDimensions!.scaledHeight) *
			offsetY;

		return {
			naturalCoordinateX: naturalCoordinateX,
			naturalCoordinateY: naturalCoordinateY,
		};
	};

	if (histologyImageCoords == null) {
		return <div>Could not find histology image coords</div>;
	}

	if (histologyImage == null || histologyImage === "") {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && (
					<LoadingSpinner asOverlay={false} message={"Loading..."} />
				)}
				{!isLoading && <div>Failed to load histology image</div>}
			</>
		);
	}

	if (labelsImage == null) {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && (
					<LoadingSpinner asOverlay={false} message={"Loading..."} />
				)}
				{!isLoading && <div>Failed to load labels</div>}
			</>
		);
	}

	return (
		<>
			<div className="histology-container">
				<div className={`histology-img-container`}>
					<ErrorModal error={error} onClear={() => setError(null)} />
					{isLoading && <LoadingSpinner asOverlay message={"Loading..."} />}

					{!showHiRes && scaledHistologyMouseCoords && (
						<MousePointer
							mouseY={scaledHistologyMouseCoords.mouseY}
							mouseX={scaledHistologyMouseCoords.mouseX}
						/>
					)}

					{!showHiRes && showLabels && (
						<HistologyLabelsImage
							labelsImage={labelsImage}
							labelsTransparency={labelsTransparency}
						/>
					)}

					{!showHiRes && (
						<HistologyLowResImage
							histologyImage={histologyImage}
							updateHistologyCoordsHandler={updateHistologyCoordsHandler}
							onImageLoad={onImageLoad}
						/>
					)}

					{showHiRes && (
						<HistologyHiResImage
							histologyImage={histologyImage}
							labelsImage={labelsImage}
							labelsTransparency={labelsTransparency}
							showHiRes={showHiRes}
							showLabels={showLabels}
							updateHistologyCoordsHandler={updateHistologyCoordsHandler}
							onImageLoad={onImageLoad}
							scaledHistologyMouseCoords={scaledHistologyMouseCoords}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default HistologyImages;
