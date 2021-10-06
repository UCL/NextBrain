import React, { FC, useState, useEffect, SyntheticEvent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";
import getMouseCoords from "../../utils/getmouseCoords";

import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyImage.css";

interface Props {
	baseAssetsUrl: string;
	patientId: string;
	histologyImageCoords: HistologyCoords | null;
	showHiRes: boolean;
	showLabels: boolean;
	labelsTransparency: string;
	channel: string;
	histologyToMri: (mouseX: number, mouseY: number) => void;
}

const HistologyImage: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [histologyImage, setHistologyImage] = useState("");
	const [hiResHistologyImage, setHiResHistologyImage] = useState("");
	const [labelsImage, setLabelsImage] = useState("");
	const [imageDimensions, setImageDimensions] = useState<{
		[key: string]: number;
	} | null>(null);
	const [scaledHistologyMouseCoords, setScaledHistologyMouseCoords] = useState<{
		[key: string]: number;
	} | null>(null);

	const {
		baseAssetsUrl,
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

				// the below code chunks can probably be combined
				if (showHiRes === false) {
					setHiResHistologyImage("");

					try {
						// setIsLoading(true);

						const histologyImage = `${baseAssetsUrl}/main/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`;

						setHistologyImage(histologyImage);
					} catch {
						console.log(
							`%cerror, could not resolve path: assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`,
							"color: red"
						);

						setError(
							`could not resolve path: assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`
						);
					}
				}

				// load hi-res image (original size)
				if (showHiRes === true) {
					try {
						setIsLoading(true);
						const hiResHistologyImage =
							await require(`../../../assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.webp`)
								.default;

						setHiResHistologyImage(hiResHistologyImage);
					} catch {
						console.log(
							`%cerror, could not resolve path: assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.webp`,
							"color: red"
						);
					}

					// I do this because of a weird behaviour on the dev server causing the loading spinner to reappear
					// I dont think this is an issue on the deployed site, so perhaps remove (or only run the logic on dev)
					if (hiResHistologyImage !== null) {
						setIsLoading(false);
					}
				}

				// load label
				try {
					//setIsLoading(true);

					const newLabelsImage = `${baseAssetsUrl}/main/${patientId}/${histologyFolder}/${paddedBlock}/slices_labels/slice_${paddedSlice}.png`;

					setLabelsImage(newLabelsImage);
				} catch {
					console.log(
						`%cerror, could not resolve path: assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_labels/slice_${paddedSlice}.png`,
						"color: red"
					);
				}
			}
		};

		fetchHistologyImage();
	}, [
		histologyImageCoords,
		showHiRes,
		channel,
		hiResHistologyImage,
		patientId,
	]);

	// take the current histology coords and calculate scaled mouseX and mouseY
	// this is to account for the fact that we scale the histology image with css using the max-height property
	useEffect(() => {
		if (imageDimensions !== null) {
			const currentHistologyMouseX = !showHiRes
				? histologyImageCoords!.coordsLowRes.mouseX
				: histologyImageCoords!.coordsHiRes.mouseX;

			const currentHistologyMouseY = !showHiRes
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
	const onImageLoad = (e: SyntheticEvent, type: string) => {
		setIsLoading(false);

		const { naturalHeight, naturalWidth, scaledHeight, scaledWidth } =
			getImageDimensions(e, type);

		setImageDimensions({
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth,
		});
	};

	// called when user clicks on a lowRes or hiRes histology image
	const updateHistologyCoordsHandler = (
		e: SyntheticEvent | Event,
		type: string
	) => {
		const { naturalCoordinateX, naturalCoordinateY } = getHistologyMousePos(
			e,
			type
		);

		// update the atlas based on new histology coords
		histologyToMri(naturalCoordinateX, naturalCoordinateY);
	};

	const onPan = (ref: any, e: Event) => {
		console.log("panning image");
		console.log(ref);

		updateHistologyCoordsHandler(e, "hiRes");
	};

	const getHistologyMousePos = (e: SyntheticEvent | Event, type: string) => {
		const { mouseX, mouseY } = getMouseCoords(e, showHiRes);

		console.log("offsetX: " + mouseX, "offsetY: " + mouseY);

		const { naturalCoordinateX, naturalCoordinateY } =
			calculateNaturalMouseCoordinates(mouseX, mouseY);

		return { naturalCoordinateX, naturalCoordinateY };
	};

	const getImageDimensions = (e: any, type: string) => {
		let naturalWidth; // the original size of the image
		let naturalHeight; // the original size of the image
		let scaledWidth; // the scaled size of the image
		let scaledHeight; // the scaled size of the image

		if (type === "onLoad" || type === "lowRes") {
			naturalWidth = e.target.naturalWidth;
			naturalHeight = e.target.naturalHeight;
			scaledWidth = e.target.width;
			scaledHeight = e.target.height;
		}

		console.log("naturalWidth: " + naturalWidth);
		console.log("naturalHeight: " + naturalHeight);
		console.log("scaledWidth: " + scaledWidth);
		console.log("scaledHeight: " + scaledHeight);

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

		console.log(
			`natural coord x: ${naturalCoordinateX}, natural coord y: ${naturalCoordinateY}`
		);

		return {
			naturalCoordinateX: naturalCoordinateX,
			naturalCoordinateY: naturalCoordinateY,
		};
	};

	if (histologyImage === null || histologyImageCoords === null) {
		return <div>Could not build histology image</div>;
	}

	return (
		<>
			<div className="histology-container">
				<div className={`histology-img-container`}>
					<ErrorModal error={error} onClear={() => setError(null)} />
					{isLoading && <LoadingSpinner asOverlay />}

					{!showHiRes && scaledHistologyMouseCoords && (
						<MousePointer
							mouseY={scaledHistologyMouseCoords.mouseY}
							mouseX={scaledHistologyMouseCoords.mouseX}
						/>
					)}

					{showLabels && !showHiRes && (
						<img
							className="histology-img-labels"
							src={labelsImage}
							alt="histology-labels"
							//onLoad={(e) => onImageLoad(e, "lowRes")}
							style={{ opacity: `${labelsTransparency}` }}
						></img>
					)}

					{!showHiRes && (
						<img
							onClick={(e) => {
								updateHistologyCoordsHandler(e, "lowRes");
							}}
							className="histology-img"
							src={histologyImage}
							alt="histology"
							onLoad={(e) => onImageLoad(e, "onLoad")}
						></img>
					)}

					{showHiRes && (
						<TransformWrapper
							wheel={{ disabled: false }}
							panning={{ velocityDisabled: true }}
							limitToBounds={true}
							onPanningStart={onPan}
							maxScale={15}
						>
							{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
								<>
									<div className="tools">
										<button onClick={() => zoomIn()}>+</button>
										<button onClick={() => zoomOut()}>-</button>
										<button onClick={() => resetTransform()}>x</button>
									</div>

									<TransformComponent>
										{scaledHistologyMouseCoords && (
											<MousePointer
												mouseY={scaledHistologyMouseCoords.mouseY}
												mouseX={scaledHistologyMouseCoords.mouseX}
											/>
										)}

										{showLabels && (
											<img
												className="histology-img-labels"
												src={labelsImage}
												alt="histology-labels"
												style={{ opacity: `${labelsTransparency}` }}
											></img>
										)}

										<img
											className={`histology-img ${showHiRes && "hi-res"}`}
											src={hiResHistologyImage}
											alt="histology"
											onLoad={(e) => onImageLoad(e, "onLoad")}
										></img>
									</TransformComponent>
								</>
							)}
						</TransformWrapper>
					)}
				</div>
			</div>
		</>
	);
};

export default HistologyImage;
