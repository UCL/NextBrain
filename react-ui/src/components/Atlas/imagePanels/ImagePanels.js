import React, { useState } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import SagittalPanel from "./SagittalPanel";
import CoronalPanel from "./CoronalPanel";
import AxialPanel from "./AxialPanel";

import "./ImagePanels.css";

const ImagePanels = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [mriSlices, setMriSlices] = useState({
		sagittal: { slice: "slice_010", x: 15, z: 5 },
		coronal: { slice: "slice_015", y: 10, z: 5 },
		axial: { slice: "slice_005", x: 15, y: 10 },
	});

	const clearError = () => {
		setError(null);
	};

	const calculateMriImages = (
		currentPanel,
		coordsX,
		coordsY,
		coordsZ,
		pickedSlice
	) => {
		const minPanelCoord = 0;
		const maxCoordSagittalX = 448;
		const maxCoordSagittalZ = 282;
		const maxCoordCoronalZ = 282;
		const maxCoordCoronalY = 224;
		const maxCoordAxialX = 448;
		const maxCoordAxialY = 224;

		if (
			currentPanel === "sagittal" &&
			(coordsX > maxCoordSagittalX || coordsZ > maxCoordSagittalZ)
		) {
			setError("Selected coordinate is out of bounds");
		}

		const tempPanel = "coronal";
		const tempCoordsX = undefined;
		const tempCoordsY = props.coronalY;
		const tempCoordsZ = props.coronalZ;
		const tempPickedSlice = "slice_004";
		const numericPickedSliceNumber = props.coronalSlice;

		const baseString = "slice_";
		const paddedSlice = numericPickedSliceNumber.toString().padStart(3, 0);
		const sliceNumberAsString = baseString + paddedSlice;

		let coordsXAsNumeric;
		let coordsYAsNumeric;
		let coordsZAsNumeric;

		let coordsXAsString;
		let coordsYAsString;
		let coordsZAsString;

		if (tempCoordsX !== undefined) {
			const paddedSlice = tempCoordsX.toString().padStart(3, 0);
			coordsXAsString = baseString + paddedSlice;
			coordsXAsNumeric = tempCoordsX;
		}

		if (tempCoordsY !== undefined) {
			const paddedSlice = tempCoordsY.toString().padStart(3, 0);
			coordsYAsString = baseString + paddedSlice;
			coordsYAsNumeric = tempCoordsY;
		}

		if (tempCoordsZ !== undefined) {
			const paddedSlice = tempCoordsZ.toString().padStart(3, 0);
			coordsZAsString = baseString + paddedSlice;
			coordsZAsNumeric = tempCoordsZ;
		}

		let newCoords;

		switch (tempPanel) {
			case "sagittal":
				newCoords = {
					sagittal: {
						slice: sliceNumberAsString,
						x: coordsXAsNumeric,
						z: coordsZAsNumeric,
					},
					coronal: {
						slice: coordsXAsString,
						y: numericPickedSliceNumber,
						z: coordsZAsNumeric,
					},
					axial: {
						slice: coordsZAsString,
						x: coordsXAsNumeric,
						y: numericPickedSliceNumber,
					},
				};
				break;
			case "coronal":
				newCoords = {
					sagittal: {
						slice: coordsYAsString,
						x: numericPickedSliceNumber,
						z: coordsZAsNumeric,
					},
					coronal: {
						slice: sliceNumberAsString,
						y: coordsYAsNumeric,
						z: coordsZAsNumeric,
					},
					axial: {
						slice: coordsZAsString,
						x: numericPickedSliceNumber,
						y: coordsYAsNumeric,
					},
				};
				break;
			case "axial":
				newCoords = {
					sagittal: {
						slice: coordsYAsString,
						x: coordsXAsNumeric,
						z: numericPickedSliceNumber,
					},
					coronal: {
						slice: coordsXAsString,
						y: coordsYAsNumeric,
						z: numericPickedSliceNumber,
					},
					axial: {
						slice: sliceNumberAsString,
						x: coordsXAsNumeric,
						y: coordsYAsNumeric,
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

			<SagittalPanel mriSlices={mriSlices} />
			<CoronalPanel mriSlices={mriSlices} />
			<AxialPanel mriSlices={mriSlices} />
			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
			<button onClick={() => calculateMriImages()}>populate</button>
		</section>
	);
};

export default ImagePanels;
