import React, { FC, useState, useEffect, SyntheticEvent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";

// import { CurrentLabel } from "../../../models/label.model";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyImage.css";

interface Props {
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

	const {
		histologyImageCoords,
		showHiRes,
		showLabels,
		labelsTransparency,
		channel,
		histologyToMri,
	} = props;

	console.log(histologyImageCoords);

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
					try {
						//setIsLoading(true);
						const histologyImage =
							await require(`../../../assets/P57-16/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`)
								.default;
						setHistologyImage(histologyImage);
					} catch {
						console.log(
							`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`,
							"color: red"
						);

						setError(
							`could not resolve path: assets/P57-16/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`
						);
					}
				}

				// load hi-res image (original size)
				if (showHiRes === true) {
					try {
						setIsLoading(true);
						const hiResHistologyImage =
							await require(`../../../assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`)
								.default;

						setHiResHistologyImage(hiResHistologyImage);
					} catch {
						console.log(
							`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`,
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
				if (showHiRes === true) {
					try {
						setIsLoading(true);
						const hiResHistologyImageReduced =
							await require(`../../../assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14_high_30.webp`)
								.default;

						setHiResHistologyImageReduced(hiResHistologyImageReduced);
					} catch {
						console.log(
							`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`,
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
					const newLabelsImage =
						await require(`../../../assets/P57-16/${histologyFolder}/45/slices_labels_rgb/slice_14.png`)
							.default;
					setLabelsImage(newLabelsImage);
				} catch {
					console.log(
						`%cerror, could not resolve path: assets/P57-16/45/${paddedBlock}/slices_labels_rgb/slice_14.png`,
						"color: red"
					);
				}
			}
		};

		fetchHistologyImage();
	}, [histologyImageCoords, showHiRes, channel, hiResHistologyImage]);

	const onImageLoad = (e: SyntheticEvent, type: string) => {
		//console.log(e.target.naturalWidth, e.target.width);

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
						<MousePointer
							mouseY={histologyImageCoords.coords.mouseY}
							mouseX={histologyImageCoords.coords.mouseX}
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
								!showHiRes && histologyToMri(e);
								// !showHiRes &&
								// 	setCurrentLabelHandler(e, histologyImageCoords, "lowRes");
							}}
							className="histology-img"
							src={histologyImage}
							alt="histology"
							//onLoad={(e) => onImageLoad(e, "lowRes")}
						></img>
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
							{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
								<>
									<div className="tools">
										<button onClick={() => zoomIn()}>+</button>
										<button onClick={() => zoomOut()}>-</button>
										<button onClick={() => resetTransform()}>x</button>
									</div>

									<TransformComponent>
										<img
											//onClick={!showHiRes ? (e) => histologyToMri(e) : undefined}
											className={`histology-img ${showHiRes ? "hi-res" : ""}`}
											src={hiResHistologyImage}
											alt="histology"
											onLoad={(e) => onImageLoad(e, "hiRes")}
										></img>
									</TransformComponent>
								</>
							)}
						</TransformWrapper>
					)} */}

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
					)}
				</div>
			</div>
		</>
	);
};

export default HistologyImage;
