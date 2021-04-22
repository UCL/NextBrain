import React, { useState } from "react";
import "./SagittalPanel.css";

const SagittalPanel = (props) => {
	const [coords, setCoords] = useState({ x: 0, y: 0 });

	const sagittalImage = require(`../../../assets/mri/slices_sagittal/${props.mriSlices["sagittal"]["slice"]}.png`)
		.default;

	// function importAll(r) {
	// 	let images = {};
	// 	r.keys().map((item, index) => {
	// 		images[item.replace("./", "")] = r(item);
	// 	});
	// 	return images;
	// }

	// const sagittalImages = importAll(
	// 	require.context(
	// 		"../../assets/mri/slices_sagittal",
	// 		false,
	// 		/\.(png|jpe?g|svg)$/
	// 	)
	// );

	const enterTarget = () => {
		console.log("target entered");
	};

	const leaveTarget = () => {
		console.log("target left");
	};

	const getCoords = (e) => {
		console.log(e);
		const xCoordinate = e.nativeEvent.offsetX * 2.24;
		const yCoordinate = e.nativeEvent.offsetY * 2.24;

		console.log(xCoordinate.toFixed(0), yCoordinate.toFixed(0));
	};

	const mouseMove = (e) => {
		console.log(e);
		const xCoordinate = e.nativeEvent.offsetX * 2.24;
		const yCoordinate = e.nativeEvent.offsetY * 2.24;

		console.log(xCoordinate.toFixed(0), yCoordinate.toFixed(0));
	};

	console.log(props.mriSlices);

	return (
		<div className="side-panel sagittal">
			{/* <div>sagittal</div> */}
			<img
				onClick={(e) => getCoords(e)}
				// onMouseEnter={() => enterTarget()}
				// onMouseLeave={() => leaveTarget()}
				// onMouseMove={(e) => mouseMove(e)}
				className="sagittal-image"
				src={sagittalImage}
				alt="sagittal-image"
			></img>
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
