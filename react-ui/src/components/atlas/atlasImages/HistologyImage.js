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
	const [options, setOptions] = useState(initialOptions);

	const { histologyImageCoords, hiRes, channel, histologyToMri } = props;

	useEffect(() => {
		fetchHistologyImage();
	}, [histologyImageCoords, hiRes, channel]);

	const fetchHistologyImage = async () => {
		// determine the correct histology image based on computed coordinates
		if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
			const paddedBlock = histologyImageCoords["currentBlock"]
				.toString()
				.padStart(2, 0);
			//console.log(paddedBlock);

			const histologySlice = histologyImageCoords.coords["slice"];
			const paddedSlice = histologySlice.toString().padStart(2, 0);

			const histologyFolder = hiRes ? "histology_hr" : "histology";

			if (hiRes === false) {
				setIsLoading(true);
				try {
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
				setIsLoading(true);
				try {
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
			}
		}
	};

	const onImageLoad = (e, type) => {
		console.log(e.target.naturalWidth, e.target.width);

		if (type === "hiRes") {
			setOptions({
				...initialOptions,
				defaultScale: e.target.width / e.target.naturalWidth,
			});
		}

		setIsLoading(false);
	};

	const onPan = (ref, e) => {
		console.log("clicked zoom image");
		console.log(ref);
		histologyToMri(e);
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

					<img
						onClick={!hiRes ? (e) => histologyToMri(e) : undefined}
						className="histology-img"
						src={histologyImage}
						alt="histology"
						onLoad={(e) => onImageLoad(e, "lowRes")}
					></img>

					{hiRes && (
						<TransformWrapper
							//disabled={true}
							wheel={{ disabled: false }}
							centerContent={true}
							limitToBounds={true}
							limitToWrapper={true}
							onPanningStart={onPan}
						>
							{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
								<React.Fragment>
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
								</React.Fragment>
							)}
						</TransformWrapper>
					)}
				</div>
			</div>
		</>
	);
};

export default HistologyImage;
