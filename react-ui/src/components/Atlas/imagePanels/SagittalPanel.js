import React, { useState, useEffect } from "react";
import "./SagittalPanel.css";

const SagittalPanel = (props) => {
	const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

	const paddedSlice = props.mriSlices["sagittal"]["slice"]
		.toString()
		.padStart(3, 0);
	const sagittalImage = require(`../../../assets/mri/slices_sagittal/slice_${paddedSlice}.png`)
		.default;

	const getCoords = (e) => {
		// no need for the *2.24 now
		const xCoordinate = e.nativeEvent.offsetX;
		const yCoordinate = e.nativeEvent.offsetY;

		console.log(xCoordinate.toFixed(0), yCoordinate.toFixed(0));

		if (
			+xCoordinate.toFixed(0) < 0 ||
			+xCoordinate.toFixed(0) > 125 ||
			+yCoordinate.toFixed(0) < 0 ||
			+yCoordinate.toFixed(0) > 200
		) {
			console.log("out of bounds");
			return;
		}

		setCoords({
			z: xCoordinate.toFixed(0),
			x: yCoordinate.toFixed(0),
			y: undefined,
		});

		props.calculateMriImages(
			"sagittal",
			coords.x,
			coords.y,
			coords.z,
			props.mriSlices["sagittal"]["slice"]
		);
	};

	console.log(coords);

	return (
		<div className="side-panel sagittal">
			{/* <div>sagittal</div> */}
			<div className="img-container">
				<div
					className="target-pointer"
					style={{ top: +coords.x - 1, left: +coords.z - 1 }}
				></div>

				<img
					onClick={(e) => getCoords(e)}
					// onMouseEnter={() => enterTarget()}
					// onMouseLeave={() => leaveTarget()}
					// onMouseMove={(e) => mouseMove(e)}
					className="sagittal-image"
					src={sagittalImage}
					alt="sagittal-image"
				></img>
			</div>

			{/* <div>
				{Object.keys(props.mriSlices.sagittal).map((prop) => (
					<>
						<div>
							<strong>{prop}: </strong>
							<strong>{props.mriSlices["sagittal"][prop]} </strong>
						</div>
					</>
				))}
			</div> */}
		</div>
	);
};

export default SagittalPanel;
