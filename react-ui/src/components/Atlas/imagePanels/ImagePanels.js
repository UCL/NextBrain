import React, { useState } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import MriPanel from "./MriPanel";

import "./ImagePanels.css";

const ImagePanels = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	// multiplied by 1.5 for coronal due to rescaling
	const [mriSlices, setMriSlices] = useState({
		sagittal: { slice: 113, x: 224, z: 141, targetTop: 224, targetLeft: 141 },
		coronal: {
			slice: 224,
			y: 113,
			z: 141,
			targetTop: 113 * 1.5,
			targetLeft: 141 * 1.5,
		},
		axial: { slice: 141, x: 224, y: 113, targetTop: 113, targetLeft: 224 },
	});

	const [mriDimensions, setMriDimensions] = useState({
		sagittal: { x: 282, y: 448 },
		coronal: { x: 282, y: 224 },
		axial: { x: 448, y: 224 },
	});

	const clearError = () => {
		setError(null);
	};

	const calculateMriImages = (
		pickedPanel,
		coordsX,
		coordsY,
		coordsZ,
		pickedSlice
	) => {
		let newCoords;

		// we have increased the size of coronal image (using css) to make it easier to see
		// as a result, we need to adjust the location of the target for coronal to keep the coordinates consistent
		// see below for further coordinate adjustments to account for coronal rescaling
		const targetRescalingFactor = 1.5;

		switch (pickedPanel) {
			case "sagittal":
				newCoords = {
					sagittal: {
						slice: pickedSlice,
						x: coordsX,
						z: coordsZ,
						targetTop: coordsX,
						targetLeft: coordsZ,
					},
					coronal: {
						slice: coordsX,
						y: pickedSlice,
						z: coordsZ,
						targetTop: pickedSlice * targetRescalingFactor,
						targetLeft: coordsZ * targetRescalingFactor,
					},
					axial: {
						slice: coordsZ,
						x: coordsX,
						y: pickedSlice,
						targetTop: pickedSlice,
						targetLeft: coordsX,
					},
				};
				break;
			case "coronal":
				// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
				coordsY = (coordsY / targetRescalingFactor).toFixed(0);
				coordsZ = (coordsZ / targetRescalingFactor).toFixed(0);

				newCoords = {
					sagittal: {
						slice: coordsY,
						x: pickedSlice,
						z: coordsZ,
						targetTop: pickedSlice,
						targetLeft: coordsZ,
					},
					coronal: {
						slice: pickedSlice,
						y: coordsY,
						z: coordsZ,
						targetTop: coordsY * targetRescalingFactor,
						targetLeft: coordsZ * targetRescalingFactor,
					},
					axial: {
						slice: coordsZ,
						x: pickedSlice,
						y: coordsY,
						targetTop: coordsY,
						targetLeft: pickedSlice,
					},
				};
				break;
			case "axial":
				newCoords = {
					sagittal: {
						slice: coordsY,
						x: coordsX,
						z: pickedSlice,
						targetTop: coordsX,
						targetLeft: pickedSlice,
					},
					coronal: {
						slice: coordsX,
						y: coordsY,
						z: pickedSlice,
						targetTop: coordsY * targetRescalingFactor,
						targetLeft: pickedSlice * targetRescalingFactor,
					},
					axial: {
						slice: pickedSlice,
						x: coordsX,
						y: coordsY,
						targetTop: coordsY,
						targetLeft: coordsX,
					},
				};
				break;
		}

		setMriSlices(newCoords);
	};

	return (
		<section className="panels-container">
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}

			<MriPanel
				plane="sagittal"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
			/>
			<MriPanel
				plane="coronal"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
			/>
			<MriPanel
				plane="axial"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				mriDimensions={mriDimensions}
			/>

			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
		</section>
	);
};

export default ImagePanels;
