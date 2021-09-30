import React, { FC, useState, useEffect, SyntheticEvent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";

// import { CurrentLabel } from "../../../models/label.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyImage.css";

interface Props {
	patientId: string;
	histologyImageCoords: HistologyCoords | null;
	showHiRes: boolean;
	showLabels: boolean;
	labelsTransparency: string;
	channel: string;
	histologyToMri: (e: React.MouseEvent) => void;
}

interface PanPinchZoomProps {
	zoomIn: () => void;
	zoomOut: () => void;
	resetTransform: () => void;
}

const HistologyImage: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [histologyImage, setHistologyImage] = useState("");
	const [hiResHistologyImage, setHiResHistologyImage] = useState("");
	const [hiResHistologyImageReduced, setHiResHistologyImageReduced] =
		useState("");
	const [labelsImage, setLabelsImage] = useState("");
	//const [initialLoad, setInitialLoad] = useState(true);

	const [hiResMousePos, setHiResMousePos] = useState({
		mouseX: 100,
		mouseY: 100,
	});

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
				const paddedBlock = histologyImageCoords["currentBlock"]
					.toString()
					.padStart(2, "0");

				const histologySlice = histologyImageCoords.coords["slice"];
				const paddedSlice = histologySlice.toString().padStart(2, "0");

				const histologyFolder = showHiRes ? "histology_hr" : "histology";

				if (showHiRes === false) {
					setHiResHistologyImage("");

					try {
						// setIsLoading(true);
						const histologyImage =
							await require(`../../../assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`)
								.default;
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

				// load hi-res image (reduced size)
				// if (showHiRes === true) {
				// 	try {
				// 		setIsLoading(true);
				// 		const hiResHistologyImageReduced =
				// 			await require(`../../../assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14_high_30.webp`)
				// 				.default;

				// 		setHiResHistologyImageReduced(hiResHistologyImageReduced);
				// 	} catch {
				// 		console.log(
				// 			`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`,
				// 			"color: red"
				// 		);
				// 	}

				// 	// I do this because of a weird behaviour on the dev server causing the loading spinner to reappear
				// 	// I dont think this is an issue on the deployed site, so perhaps remove (or only run the logic on dev)
				// 	if (hiResHistologyImage !== null) {
				// 		setIsLoading(false);
				// 	}
				// }

				// load label
				try {
					//setIsLoading(true);
					const newLabelsImage =
						await require(`../../../assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_labels/slice_${paddedSlice}.png`)
							.default;
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

	const onImageLoad = (e: SyntheticEvent, type: string) => {
		//console.log(e.target.naturalWidth, e.target.width);
		console.log("hi res image loaded");

		if (type === "lowRes") setIsLoading(false);

		if (type === "hiRes") {
			// setOptions({
			// 	...initialOptions,
			// 	defaultScale: e.target.width / e.target.naturalWidth,
			// });
			setIsLoading(false);
		}
	};

	const onPan = (ref: any, e: Event) => {
		console.log("panning image");
		console.log(ref);

		getHistologyMousePos(e, "hiRes");

		//histologyToMri(e);
	};

	const onImageZoomStart = (ref: any, e: Event) => {
		//setIsLoading(true);
		console.log("start zoom image");
		console.log(ref);
	};

	const onImageZoom = (ref: any, e: Event) => {
		//setIsLoading(true);
		console.log("during zoom image");
		console.log(ref);
	};

	const onImageZoomStop = (ref: any, e: Event) => {
		//setIsLoading(false);
		console.log("end zoom image");
		console.log(ref);
	};

	const calculateHiResMousePos = (
		naturalCoordinateX: number,
		naturalCoordinateY: number,
		naturalHeight: number,
		naturalWidth: number,
		scaledHeight: number,
		scaledWidth: number
	) => {
		const hiResMousePosX = (scaledWidth / naturalWidth) * naturalCoordinateX;
		const hiResMousePosY = (scaledHeight / naturalHeight) * naturalCoordinateY;

		setHiResMousePos({ mouseX: hiResMousePosX, mouseY: hiResMousePosY });
	};

	// merge this with getMouseCoords.ts
	const getHistologyMousePos = (e: any, type: string) => {
		const offsetX = type === "lowRes" ? e.nativeEvent.offsetX : e.offsetX;
		const offsetY = type === "lowRes" ? e.nativeEvent.offsetY : e.offsetY;

		console.log("offsetX: " + offsetX, "offsetY: " + offsetY);

		console.log(e);

		const {
			naturalCoordinateX,
			naturalCoordinateY,
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth,
		} = getNaturalCoordinates(e, offsetX, offsetY, type);

		calculateHiResMousePos(
			naturalCoordinateX,
			naturalCoordinateY,
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth
		);
	};

	// account for the fact that we set max-height on the histology image
	// this function allows us to extract the natural coordinates, given the max-height css property
	const getNaturalCoordinates = (
		e: any,
		offsetX: any,
		offsetY: any,
		type: string
	) => {
		// we target childNodes[1] because it points to the histology image
		const naturalWidth =
			type === "lowRes"
				? e.target.naturalWidth
				: e.target.childNodes[1].naturalWidth; // the original size of the image
		const naturalHeight =
			type === "lowRes"
				? e.target.naturalHeight
				: e.target.childNodes[1].naturalHeight; // the original size of the image
		const scaledWidth =
			type === "lowRes" ? e.target.width : e.target.childNodes[1].width; // the scaled size of the image
		const scaledHeight =
			type === "lowRes" ? e.target.height : e.target.childNodes[1].height; // the scaled size of the image

		console.log("naturalWidth: " + naturalWidth);
		console.log("naturalHeight: " + naturalHeight);
		console.log("scaledWidth: " + scaledWidth);
		console.log("scaledHeight: " + scaledHeight);

		// make sure the coordinate does not exceed the maximum bounds (else the calculation will be off)
		offsetX = offsetX > scaledWidth ? scaledWidth : offsetX;
		offsetY = offsetY > scaledHeight ? scaledHeight : offsetY;

		const naturalCoordinateX = (naturalWidth / scaledWidth) * offsetX;
		const naturalCoordinateY = (naturalHeight / scaledHeight) * offsetY;

		console.log(
			`natural coord x: ${naturalCoordinateX}, natural coord y: ${naturalCoordinateY}`
		);

		return {
			naturalCoordinateX: naturalCoordinateX,
			naturalCoordinateY: naturalCoordinateY,
			naturalHeight: naturalHeight,
			naturalWidth: naturalWidth,
			scaledHeight: scaledHeight,
			scaledWidth: scaledWidth,
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

					{!showHiRes && (
						// <MousePointer
						// 	mouseY={histologyImageCoords.coords.mouseY}
						// 	mouseX={histologyImageCoords.coords.mouseX}
						// />
						<MousePointer
							mouseY={hiResMousePos.mouseY}
							mouseX={hiResMousePos.mouseX}
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
							//onClick={!showHiRes ? (e) => histologyToMri(e) : undefined}
							onClick={(e) => {
								histologyToMri(e);
								// getHistologyMousePos(e, "lowRes");
							}}
							className="histology-img"
							src={histologyImage}
							alt="histology"
							// onLoad={(e) => onImageLoad(e, "lowRes")}
						></img>
					)}

					{showHiRes && (
						<TransformWrapper
							//disabled={true}
							wheel={{ disabled: false }}
							panning={{ velocityDisabled: true }}
							limitToBounds={true}
							onPanningStart={onPan}
							onZoomStart={onImageZoomStart}
							onZoom={onImageZoom}
							onZoomStop={onImageZoomStop}
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
										<MousePointer
											mouseX={hiResMousePos.mouseX}
											mouseY={hiResMousePos.mouseY}
										/>

										{showLabels && (
											<img
												className="histology-img-labels"
												src={labelsImage}
												alt="histology-labels"
												//onLoad={(e) => onImageLoad(e, "lowRes")}
												style={{ opacity: `${labelsTransparency}` }}
											></img>
										)}

										<img
											//onClick={!showHiRes ? (e) => histologyToMri(e) : undefined}
											//onClick={(e) => getMousePos(e)}
											className={`histology-img ${showHiRes ? "hi-res" : ""}`}
											src={hiResHistologyImage}
											alt="histology"
											onLoad={(e) => onImageLoad(e, "hiRes")}
										></img>
									</TransformComponent>
								</>
							)}
						</TransformWrapper>
					)}

					{/* {showHiRes && (
						<TransformWrapper
							//disabled={true}
							wheel={{ disabled: false }}
							panning={{ velocityDisabled: true }}
							limitToBounds={true}
							onPanningStart={onPan}
							onZoomStart={onImageZoomStart}
							onZoom={onImageZoom}
							onZoomStop={onImageZoomStop}
							maxScale={25}
						>
							{({ zoomIn, zoomOut, resetTransform }: PanPinchZoomProps) => (
								<>
									<div className="tools">
										<button onClick={() => zoomIn()}>+</button>
										<button onClick={() => zoomOut()}>-</button>
										<button onClick={() => resetTransform()}>x</button>
									</div>

									<TransformComponent>
										{showLabels && (
											<img
												//onClick={!showHiRes ? (e) => histologyToMri(e) : undefined}
												className="histology-img-labels"
												src={labelsImage}
												alt="histology-labels"
												//onLoad={(e) => onImageLoad(e, "lowRes")}
												style={{ opacity: `${labelsTransparency}` }}
											></img>
										)}

										<img
											//onClick={!showHiRes ? (e) => histologyToMri(e) : undefined}
											className={`histology-img ${showHiRes ? "hi-res" : ""}`}
											src={hiResHistologyImageReduced}
											alt="histology"
											onLoad={(e) => onImageLoad(e, "lowRes")}
										></img>
									</TransformComponent>
								</>
							)}
						</TransformWrapper>
					)} */}
				</div>
			</div>
		</>
	);
};

export default HistologyImage;
