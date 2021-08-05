import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import MousePointer from "../../shared/MousePointer";

import "./HistologyImage.css";

const HistologyImage = (props) => {
	const initialOptions = {
		centerContent: false,
		limitToBounds: false,
		limitToWrapper: true,
		disabled: true,
	};

	const [histologyImage, setHistologyImage] = useState(null);
	const [options, setOptions] = useState(initialOptions);

	const { histologyImageCoords, hiRes, channel, histologyToMri } = props;

	useEffect(() => {
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
				try {
					const histologyImage =
						require(`../../../assets/P57-16/${histologyFolder}/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`).default;
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
					const histologyImage =
						require(`../../../assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`).default;
					setHistologyImage(histologyImage);
				} catch {
					console.log(
						`%cerror, could not resolve path: assets/P57-16/${histologyFolder}/45/slices_LFB/slice_14.jpg`,
						"color: red"
					);
				}
			}
		}
	}, [histologyImageCoords, hiRes, channel]);

	const onLoad = (e) => {
		console.log(e.target.naturalWidth, e.target.width);
		setOptions({
			...initialOptions,
			defaultScale: e.target.width / e.target.naturalWidth,
		});
	};

	const onPan = (ref, event) => {
		console.log("clicked zoom image");
		console.log(ref);
		histologyToMri(event);
	};

	if (histologyImage === null) {
		return <div>Could not build histology image</div>;
	}

	return (
		<div className="histology-img histology">
			<div className={`histology-img-container`}>
				<MousePointer type="histology" imageCoords={histologyImageCoords} />

				<img
					onClick={!hiRes ? (e) => histologyToMri(e) : undefined}
					className="histology-img"
					src={histologyImage}
					alt="histology"
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
										src={histologyImage}
										alt="histology"
										onLoad={onLoad}
									></img>
								</TransformComponent>
							</React.Fragment>
						)}
					</TransformWrapper>
				)}
			</div>
		</div>
	);
};

export default HistologyImage;
