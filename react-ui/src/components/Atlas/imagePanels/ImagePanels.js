import React, { useState } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriPanel from "./MriPanel";

import CORONAL_RESCALING_FACTOR from "../../utils/CoronalRescalingFactor";

import "./ImagePanels.css";

const ImagePanels = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [mriDimensions, setMriDimensions] = useState({
		sagittal: { x: 282, y: 448 },
		coronal: { x: 282, y: 224 },
		axial: { x: 448, y: 224 },
	});

	const [mriImages, setMriImages] = useState({
		sagittal: { slice: 113, mouseY: 224, mouseX: 141 },
		coronal: {
			slice: 224,
			mouseY: 113 * CORONAL_RESCALING_FACTOR,
			mouseX: 141 * CORONAL_RESCALING_FACTOR,
		},
		axial: { slice: 141, mouseY: 113, mouseX: 224 },
	});

	const clearError = () => {
		setError(null);
	};

	const calculateMriImages = (
		currentPlane,
		coordsX,
		coordsY,
		coordsZ,
		currentSlice
	) => {
		let newMriParams;

		switch (currentPlane) {
			case "sagittal":
				newMriParams = {
					sagittal: {
						slice: currentSlice,
						mouseY: coordsX,
						mouseX: coordsZ,
					},
					coronal: {
						slice: coordsX,
						mouseY: currentSlice * CORONAL_RESCALING_FACTOR,
						mouseX: coordsZ * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: coordsZ,
						mouseY: currentSlice,
						mouseX: coordsX,
					},
				};
				break;
			case "coronal":
				// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
				coordsY = (coordsY / CORONAL_RESCALING_FACTOR).toFixed(0);
				coordsZ = (coordsZ / CORONAL_RESCALING_FACTOR).toFixed(0);

				newMriParams = {
					sagittal: {
						slice: coordsY,
						mouseY: currentSlice,
						mouseX: coordsZ,
					},
					coronal: {
						slice: currentSlice,
						mouseY: coordsY * CORONAL_RESCALING_FACTOR,
						mouseX: coordsZ * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: coordsZ,
						mouseY: coordsY,
						mouseX: currentSlice,
					},
				};
				break;
			case "axial":
				newMriParams = {
					sagittal: {
						slice: coordsY,
						mouseY: coordsX,
						mouseX: currentSlice,
					},
					coronal: {
						slice: coordsX,
						mouseY: coordsY * CORONAL_RESCALING_FACTOR,
						mouseX: currentSlice * CORONAL_RESCALING_FACTOR,
					},
					axial: {
						slice: currentSlice,
						mouseY: coordsY,
						mouseX: coordsX,
					},
				};
				break;
		}

		setMriImages(newMriParams);
	};

	return (
		<section className="panels-container">
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriPanel
				plane="sagittal"
				mriImages={mriImages}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
			/>
			<MriPanel
				plane="coronal"
				mriImages={mriImages}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
				coronalRescalingFactor={CORONAL_RESCALING_FACTOR}
			/>
			<MriPanel
				plane="axial"
				mriImages={mriImages}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
			/>

			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
		</section>
	);
};

export default ImagePanels;
