import React, { useState } from "react";
import "./SagittalPanel.css";

const SagittalPanel = (props) => {
	const [coords, setCoords] = useState({ x: 0, y: 0 });

	const sagittalImage = require(`../../../assets/mri/slices_sagittal/${props.mriSlices["sagittal"]["slice"]}.png`)
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

		setCoords({ x: xCoordinate.toFixed(0), y: yCoordinate.toFixed(0) });
	};

	console.log(coords);

	return (
		<div className="side-panel sagittal">
			{/* <div>sagittal</div> */}
			<div className="img-container">
				<div
					className="target-pointer"
					style={{ top: +coords.y - 1, left: +coords.x - 1 }}
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
