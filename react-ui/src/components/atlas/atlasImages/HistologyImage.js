import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";

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
	const [options, setOptions] = useState(initialOptions);
	const [initialLoad, setInitialLoad] = useState(true);

	const { histologyImageCoords, hiRes, channel, histologyToMri } = props;

	console.log(initialLoad);
	console.log(hiResHistologyImage);
	console.log(hiResHistologyImage);

	useEffect(() => {
		fetchHistologyImage();
	}, [histologyImageCoords, hiRes, channel]);

	const fetchHistologyImage = async () => {
		// determine the correct histology image based on computed coordinates
		if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
			const paddedBlock = histologyImageCoords["currentBlock"]
				.toString()
				.padStart(2, 0);

			const histologySlice = histologyImageCoords.coords["slice"];
			const paddedSlice = histologySlice.toString().padStart(2, 0);

			const histologyFolder = hiRes ? "histology_hr" : "histology";

			if (hiRes === false) {
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

			if (hiRes === true) {
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

			if (hiRes === true) {
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

	if (histologyImage === null) {
		return <div>Could not build histology image</div>;
	}

	return (
		<>
			<div className="histology-img histology">
				<div className={`histology-img-container`}>
					{isLoading && <LoadingSpinner asOverlay />}
					<MousePointer type="histology" imageCoords={histologyImageCoords} />

					<div className="label"></div>

					<img
						onClick={!hiRes ? (e) => histologyToMri(e) : undefined}
						className="histology-img"
						src={histologyImage}
						alt="histology"
						//onLoad={(e) => onImageLoad(e, "lowRes")}
					></img>

					{hiRes && (
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
											//onClick={!hiRes ? (e) => histologyToMri(e) : undefined}
											className={`histology-img ${hiRes ? "hi-res" : ""}`}
											src={hiResHistologyImage}
											alt="histology"
											onLoad={(e) => onImageLoad(e, "hiRes")}
										></img>
									</TransformComponent>
								</>
							)}
						</TransformWrapper>
					)}

					{hiRes && (
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
											//onClick={!hiRes ? (e) => histologyToMri(e) : undefined}
											className={`histology-img ${hiRes ? "hi-res" : ""}`}
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
