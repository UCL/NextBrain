import React, { useEffect, useState } from "react";

import CORONAL_RESCALING_FACTOR from "../utils/CoronalRescalingFactor";

import "./MousePointer.css";

const MousePointer = (props) => {
	const [adjustedImageCoords, setAdjustedImageCoords] = useState(null);

	const { type, plane, imageCoords } = props;

	useEffect(() => {
		// adjust the mouse coordinates based on the coronal rescaling factor

		// mouseX = mouseX / CORONAL_RESCALING_FACTOR;
		// mouseY = mouseY / CORONAL_RESCALING_FACTOR;

		// mouseX = Number(mouseX);
		// mouseY = Number(mouseY);
		if (type === "mri" && plane === "coronal") {
			console.log(plane, imageCoords);
			const newCoords = {
				sagittal: {
					slice: imageCoords["sagittal"].slice,
					mouseX: imageCoords["sagittal"].mouseX / CORONAL_RESCALING_FACTOR,
					mouseY: imageCoords["sagittal"].mouseY / CORONAL_RESCALING_FACTOR,
				},
				coronal: {
					slice: imageCoords["coronal"].slice,
					mouseX: imageCoords["coronal"].mouseX,
					mouseY: imageCoords["coronal"].mouseY,
				},
				axial: {
					slice: imageCoords["axial"].slice,
					mouseX: imageCoords["axial"].mouseX / CORONAL_RESCALING_FACTOR,
					mouseY: imageCoords["axial"].mouseY / CORONAL_RESCALING_FACTOR,
				},
			};
			console.log(newCoords);

			setAdjustedImageCoords(newCoords);
		}

		if (type === "mri" && (plane == "sagittal" || plane === "axial")) {
			console.log(plane, imageCoords);
			const newCoords = {
				sagittal: {
					slice: imageCoords["sagittal"].slice,
					mouseX: imageCoords["sagittal"].mouseX,
					mouseY: imageCoords["sagittal"].mouseY,
				},
				coronal: {
					slice: imageCoords["coronal"].slice,
					mouseX: imageCoords["coronal"].mouseX * CORONAL_RESCALING_FACTOR,
					mouseY: imageCoords["coronal"].mouseY * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: imageCoords["axial"].slice,
					mouseX: imageCoords["axial"].mouseX,
					mouseY: imageCoords["axial"].mouseY,
				},
			};
			console.log(newCoords);

			setAdjustedImageCoords(newCoords);
		}
	}, [imageCoords]);

	if (adjustedImageCoords === null || adjustedImageCoords === undefined) {
		return <div>none</div>;
	}

	if (imageCoords === null || imageCoords === undefined) {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: 100,
					left: 100,
				}}
			></div>
		);
	}

	if (type === "mri") {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: +adjustedImageCoords[plane].mouseY,
					left: +adjustedImageCoords[plane].mouseX,
				}}
			></div>
		);
	}

	if (type === "histology") {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: +imageCoords.coords.mouseY,
					left: +imageCoords.coords.mouseX,
				}}
			></div>
		);
	}
};

export default MousePointer;
