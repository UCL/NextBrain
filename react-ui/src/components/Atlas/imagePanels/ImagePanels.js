import React, { useState } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import SagittalPanel from "./SagittalPanel";
import CoronalPanel from "./CoronalPanel";
import AxialPanel from "./AxialPanel";
import MriPanel from "./MriPanel";

import "./ImagePanels.css";

const ImagePanels = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [mriSlices, setMriSlices] = useState({
		sagittal: { slice: 10, x: 15, z: 5, targetTop: 15, targetLeft: 5 },
		coronal: { slice: 15, y: 10, z: 5, targetTop: 10, targetLeft: 5 },
		axial: { slice: 5, x: 15, y: 10, targetTop: 10, targetLeft: 15 },
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
						targetTop: pickedSlice,
						targetLeft: coordsZ,
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
				newCoords = {
					sagittal: {
						slice: coordsY,
						x: pickedSlice,
						z: coordsZ,
						targetTop: coordsZ,
						targetLeft: pickedSlice,
					},
					coronal: {
						slice: pickedSlice,
						y: coordsY,
						z: coordsZ,
						targetTop: coordsY,
						targetLeft: coordsZ,
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
						targetTop: coordsY,
						targetLeft: pickedSlice,
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

			{/* <SagittalPanel
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
			/>
			<CoronalPanel mriSlices={mriSlices} />
			<AxialPanel mriSlices={mriSlices} /> */}

			<MriPanel
				plane="sagittal"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				targetTop={10}
				targetLeft={10}
			/>
			<MriPanel
				plane="coronal"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				targetTop={10}
				targetLeft={10}
			/>
			<MriPanel
				plane="axial"
				mriSlices={mriSlices}
				calculateMriImages={calculateMriImages}
				targetTop={10}
				targetLeft={10}
			/>

			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
			{/* <button onClick={() => calculateMriImages()}>populate</button> */}
		</section>
	);
};

export default ImagePanels;
