import React, { FC, useState, useEffect, SyntheticEvent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";
import getMouseCoords from "../../utils/getmouseCoords";

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
	histologyToMri: (mouseX: number, mouseY: number) => void;
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
	const [imageDimensions, setImageDimensions] = useState<any>(null);
	//const [initialLoad, setInitialLoad] = useState(true);

	const [hiResMousePos, setHiResMousePos] = useState({
		mouseX: 100,
		mouseY: 100,
	});

	console.log(imageDimensions);

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

	useEffect(() => {
		if (imageDimensions !== null) {
			const mouseX = histologyImageCoords!.coords.mouseX;
			const mouseY = histologyImageCoords!.coords.mouseY;

			const naturalHeight = imageDimensions.naturalHeight;
			const naturalWidth = imageDimensions.naturalWidth;
			const scaledHeight = imageDimensions.scaledHeight;
			const scaledWidth = imageDimensions.scaledWidth;

			calculateHiResMousePos(
				mouseX,
				mouseY,
				naturalHeight,
				naturalWidth,
				scaledHeight,
				scaledWidth
			);
		}
	}, [histologyImageCoords, imageDimensions]);

	const onImageLoad = (e: SyntheticEvent, type: string) => {
		//console.log(e.target.naturalWidth, e.target.width);

		console.log(e);

		if (type === "lowRes") setIsLoading(false);

		if (type === "hiRes") {
			// setOptions({
			// 	...initialOptions,
			// 	defaultScale: e.target.width / e.target.naturalWidth,
			// });
			setIsLoading(false);
		}

		// const mouseX = histologyImageCoords!.coords.mouseX;
		// const mouseY = histologyImageCoords!.coords.mouseY;

		const { naturalHeight, naturalWidth, scaledHeight, scaledWidth } =
			getImageDimensions(e, type);

		// store image dimensions se we can correctly calculate the mouse coordinates for scaled images
		setImageDimensions({
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth,
		});

		// calculateHiResMousePos(
		// 	mouseX,
		// 	mouseY,
		// 	naturalHeight,
		// 	naturalWidth,
		// 	scaledHeight,
		// 	scaledWidth
		// );
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

		console.log(
			`scaled coord x: ${hiResMousePosX}, scaled coord y: ${hiResMousePosY}`
		);

		// I should be getting the hi-res mouse pos from the data that is set when I call histologyToMri()
		// but it seems the matrix calculation gives me mouse coordinates that are always off by a certain margin
		// I need to investigate why the matrix calculation gives me coordinates that are always slightly off

		// in fact, the coordinates are also slightly off when moving from mri to histology
		// it looks like they are off by the same margin as described above
		// so something is going on here

		// it looks like it might be a matrix calculation problem
		// I think I am following the steps correctly, so my hunch is that their matrices are not correct
		// when I compared the matrices that I have against Adrias example pdf, the numbers were slightly different

		// I have done some manual testing of the matrix multiplications in python and my maths is correct
		// so the way I am calculating the vectors and the matrices is all mathematically correct in javascript
		// I compared the result I got from python and the result i got in javascript and they were the same
		// so again I think the problem is the fact that the matrices may not be correct on their end
		setHiResMousePos({ mouseX: hiResMousePosX, mouseY: hiResMousePosY });
	};

	const getHistologyMousePos = (e: any, type: string) => {
		const { mouseX, mouseY } = getMouseCoords(e, showHiRes);

		console.log("offsetX: " + mouseX, "offsetY: " + mouseY);

		console.log(e);

		const { naturalHeight, naturalWidth, scaledHeight, scaledWidth } =
			getImageDimensions(e, type);

		const { naturalCoordinateX, naturalCoordinateY } = getNaturalCoordinates(
			mouseX,
			mouseY,
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth
		);

		calculateHiResMousePos(
			naturalCoordinateX,
			naturalCoordinateY,
			naturalHeight,
			naturalWidth,
			scaledHeight,
			scaledWidth
		);

		histologyToMri(naturalCoordinateX, naturalCoordinateY);
	};

	// const getImageDimensions = (e: any, type: string) => {
	// 	const naturalWidth = e.target.naturalWidth; // the original size of the image
	// 	const naturalHeight = e.target.naturalHeight; // the original size of the image
	// 	const scaledWidth = e.target.width; // the scaled size of the image
	// 	const scaledHeight = e.target.height; // the scaled size of the image

	// 	console.log("naturalWidth: " + naturalWidth);
	// 	console.log("naturalHeight: " + naturalHeight);
	// 	console.log("scaledWidth: " + scaledWidth);
	// 	console.log("scaledHeight: " + scaledHeight);

	// 	return {
	// 		naturalHeight,
	// 		naturalWidth,
	// 		scaledHeight,
	// 		scaledWidth,
	// 	};
	// };

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

		if (type === "hiRes") {
			naturalWidth = e.target.childNodes[1].naturalWidth;
			naturalHeight = e.target.childNodes[1].naturalHeight;
			scaledWidth = e.target.childNodes[1].width;
			scaledHeight = e.target.childNodes[1].height;
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

	// account for the fact that we set max-height on the histology image
	// this function allows us to extract the natural coordinates, given the max-height css property
	const getNaturalCoordinates = (
		offsetX: number,
		offsetY: number,
		naturalHeight: number,
		naturalWidth: number,
		scaledHeight: number,
		scaledWidth: number
	) => {
		const naturalCoordinateX = (naturalWidth / scaledWidth) * offsetX;
		const naturalCoordinateY = (naturalHeight / scaledHeight) * offsetY;

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
								//histologyToMri(e);
								getHistologyMousePos(e, "lowRes");
							}}
							className="histology-img"
							src={histologyImage}
							alt="histology"
							onLoad={(e) => onImageLoad(e, "onLoad")}
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
											mouseY={histologyImageCoords.coords.mouseY}
											mouseX={histologyImageCoords.coords.mouseX}
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
											onLoad={(e) => onImageLoad(e, "onLoad")}
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
