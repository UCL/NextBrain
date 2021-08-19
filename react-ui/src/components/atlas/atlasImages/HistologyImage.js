import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";
import histologyLabelParser from "../../utils/histologyLabelParser";
import getMouseCoords from "../../utils/getmouseCoords";

import "./HistologyImage.css";

const initialOptions = {
	centerContent: false,
	limitToBounds: false,
	limitToWrapper: true,
	disabled: true,
};

const HistologyImage = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [histologyImage, setHistologyImage] = useState(null);
	const [hiResHistologyImage, setHiResHistologyImage] = useState(null);
	const [hiResHistologyImage2, setHiResHistologyImage2] = useState(null);
	const [labelsImage, setLabelsImage] = useState(null);
	const [options, setOptions] = useState(initialOptions);
	const [initialLoad, setInitialLoad] = useState(true);

	const {
		histologyImageCoords,
		showHiRes,
		showLabels,
		labelsTransparency,
		setCurrentLabel,
		channel,
		histologyToMri,
	} = props;

	useEffect(() => {
		fetchHistologyImage();
	}, [histologyImageCoords, showHiRes, channel]);

	const fetchHistologyImage = async () => {
		// determine the correct histology image based on computed coordinates
		if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
			const paddedBlock = histologyImageCoords["currentBlock"]
				.toString()
				.padStart(2, 0);

			const histologySlice = histologyImageCoords.coords["slice"];
			const paddedSlice = histologySlice.toString().padStart(2, 0);

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
				}
			}

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
				if (initialLoad === true && hiResHistologyImage !== null) {
					setIsLoading(false);
				}
			}

			if (showHiRes === true) {
				try {
					setIsLoading(true);
					const hiResHistologyImage2 =
						await require(`../../../assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14_high_30.jpg`)
							.default;

					setHiResHistologyImage2(hiResHistologyImage2);
				} catch {
					console.log(
						`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`,
						"color: red"
					);
				}

				// I do this because of a weird behaviour on the dev server causing the loading spinner to reappear
				// I dont think this is an issue on the deployed site, so perhaps remove (or only run the logic on dev)
				if (initialLoad === true && hiResHistologyImage !== null) {
					setIsLoading(false);
				}
			}

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

	const onImageLoad = (e, type) => {
		console.log(e.target.naturalWidth, e.target.width);

		if (type === "lowRes") setIsLoading(false);

		if (type === "hiRes") {
			setOptions({
				...initialOptions,
				defaultScale: e.target.width / e.target.naturalWidth,
			});
			setIsLoading(false);
		}
	};

	const onPan = (ref, e) => {
		console.log("panning image");
		console.log(ref);
		//histologyToMri(e);
	};

	const onImageZoomStart = (ref, e) => {
		//setIsLoading(true);
		console.log("start zoom image");
		console.log(ref);
	};

	const onImageZoom = (ref, e) => {
		//setIsLoading(true);
		console.log("during zoom image");
		console.log(ref);
	};

	const onImageZoomStop = (ref, e) => {
		//setIsLoading(false);
		console.log("end zoom image");
		console.log(ref);
	};

	const setCurrentLabelHandler = async (e, histologyImageCoords, type) => {
		console.log("getting current histology label");

		const { mouseX, mouseY } = getMouseCoords(e);

		const currentLabel = await histologyLabelParser(
			mouseX,
			mouseY,
			histologyImageCoords,
			type
		);

		setCurrentLabel(currentLabel);
	};

	if (histologyImage === null) {
		return <div>Could not build histology image</div>;
	}

	return (
		<>
			<div className="histology-container">
				<div className={`histology-img-container`}>
					{isLoading && <LoadingSpinner asOverlay />}

					{!showHiRes && (
						<MousePointer type="histology" imageCoords={histologyImageCoords} />
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
								!showHiRes &&
									setCurrentLabelHandler(e, histologyImageCoords, "lowRes");
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
							centerContent={true}
							limitToBounds={true}
							limitToWrapper={true}
							onPanningStart={onPan}
							onZoomStart={onImageZoomStart}
							onZoom={onImageZoom}
							onZoomStop={onImageZoomStop}
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
							centerContent={true}
							limitToBounds={true}
							limitToWrapper={true}
							onPanningStart={onPan}
							onZoomStart={onImageZoomStart}
							onZoom={onImageZoom}
							onZoomStop={onImageZoomStop}
						>
							{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
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
											src={hiResHistologyImage2}
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
