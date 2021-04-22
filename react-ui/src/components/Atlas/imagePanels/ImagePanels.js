import React, { useState } from "react";

import SagittalPanel from "./SagittalPanel";
import CoronalPanel from "./CoronalPanel";
import AxialPanel from "./AxialPanel";

import "./ImagePanels.css";

const ImagePanels = (props) => {
	const [mriSlices, setMriSlices] = useState({
		sagittal: { slice: "slice_010", x: 15, z: 5 },
		coronal: { slice: "slice_015", y: 10, z: 5 },
		axial: { slice: "slice_005", x: 15, y: 10 },
	});

	const calculateMriImages = (
		currentPanel,
		coordsX,
		coordsY,
		coordsZ,
		pickedSlice
	) => {
		const tempPanel = "coronal";
		const tempCoordsX = undefined;
		const tempCoordsY = props.coronalY;
		const tempCoordsZ = props.coronalZ;
		const tempPickedSlice = "slice_004";
		const numericPickedSliceNumber = props.coronalSlice;

		const baseString = "slice_";

		const paddedSlice = numericPickedSliceNumber.toString().padStart(3, 0);

		const sliceNumberAsString = baseString + paddedSlice;

		let coordsXAsString;
		let coordsYAsString;
		let coordsZAsString;

		if (tempCoordsX !== undefined) {
			const paddedSlice = tempCoordsX.toString().padStart(3, 0);
			coordsXAsString = baseString + paddedSlice;
		}

		if (tempCoordsY !== undefined) {
			const paddedSlice = tempCoordsY.toString().padStart(3, 0);
			coordsYAsString = baseString + paddedSlice;
		}

		if (tempCoordsZ !== undefined) {
			const paddedSlice = tempCoordsZ.toString().padStart(3, 0);
			coordsZAsString = baseString + paddedSlice;
		}

		let newCoords;

		switch (tempPanel) {
			case "sagittal":
				newCoords = {
					sagittal: {
						slice: sliceNumberAsString,
						x: coordsXAsString,
						z: coordsZAsString,
					},
					coronal: {
						slice: coordsXAsString,
						y: sliceNumberAsString,
						z: coordsZAsString,
					},
					axial: {
						slice: coordsZAsString,
						x: coordsXAsString,
						y: sliceNumberAsString,
					},
				};
				break;
			case "coronal":
				newCoords = {
					sagittal: {
						slice: coordsYAsString,
						x: sliceNumberAsString,
						z: coordsZAsString,
					},
					coronal: {
						slice: sliceNumberAsString,
						y: coordsYAsString,
						z: coordsZAsString,
					},
					axial: {
						slice: coordsZAsString,
						x: sliceNumberAsString,
						y: coordsYAsString,
					},
				};
				break;
			case "axial":
				newCoords = {
					sagittal: {
						slice: coordsYAsString,
						x: coordsXAsString,
						z: sliceNumberAsString,
					},
					coronal: {
						slice: coordsXAsString,
						y: coordsYAsString,
						z: sliceNumberAsString,
					},
					axial: {
						slice: sliceNumberAsString,
						x: coordsXAsString,
						y: coordsYAsString,
					},
				};
				break;
		}

		setMriSlices(newCoords);
	};

	return (
		<section className="panels-container">
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
