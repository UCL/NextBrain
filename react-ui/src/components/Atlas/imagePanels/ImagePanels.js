import React, { useState } from "react";

import SagittalPanel from "./SagittalPanel";
import CoronalPanel from "./CoronalPanel";
import AxialPanel from "./AxialPanel";

import "./ImagePanels.css";

const ImagePanels = () => {
	const [mriSlices, setMriSlices] = useState({
		sagittal: { slice: "slice_010", x: 15, z: 5 },
		coronal: { slice: "slice_015", y: 10, z: 5 },
		axial: { slice: "slice_005", x: 15, y: 10 },
	});

	const calculateMriImages = (coords, currentPanel, pickedSlice) => {
		const tempCoords = [10, 20];
		const tempPanel = "sagittal";
		const tempPickedSlice = "slice_010";

		let currentPanelPlanes;
		let orthogonalAxis;

		switch (tempPanel) {
			case "sagittal":
				currentPanelPlanes = ["z", "x"];
				break;
			case "coronal":
				currentPanelPlanes = ["z", "y"];
				break;
			case "axial":
				currentPanelPlanes = ["x", "y"];
				break;
			default:
				currentPanelPlanes = ["x", "y"];
		}

		switch (tempPanel) {
			case "sagittal":
				orthogonalAxis = "y";
				break;
			case "coronal":
				orthogonalAxis = "x";
				break;
			case "axial":
				orthogonalAxis = "z";
				break;
			default:
				orthogonalAxis = "z";
		}

		const sagittalSlice = {
			slice: tempPickedSlice,
			x: tempCoords[0],
			z: tempCoords[1],
		};

		const coronalSlice = {
			slice: tempPickedSlice,
			x: tempCoords[0],
			z: tempCoords[1],
		};

		const axialSlice = {
			slice: tempPickedSlice,
			x: tempCoords[0],
			z: tempCoords[1],
		};

		setMriSlices({
			sagittal: { slice: "slice_010", x: 15, z: 5 },
			coronal: { slice: "slice_015", y: 10, z: 5 },
			axial: { slice: "slice_005", x: 15, y: 10 },
		});
	};

	return (
		<section className="panels-container">
			<SagittalPanel mriSlices={mriSlices} />
			<CoronalPanel mriSlices={mriSlices} />
			<AxialPanel mriSlices={mriSlices} />
			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
		</section>
	);
};

export default ImagePanels;
