import React, { useState, useEffect } from "react";
import "./MriPanel.css";

const MriPanel = (props) => {
	const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

	const { plane, mriSlices, calculateMriImages } = props;

	const paddedSlice = props.mriSlices[plane]["slice"].toString().padStart(3, 0);
	const mriImage = require(`../../../assets/mri/slices_${plane}/slice_${paddedSlice}.png`)
		.default;

	const getCoords = (e) => {
		const xCoordinate = e.nativeEvent.offsetX;
		const yCoordinate = e.nativeEvent.offsetY;

		console.log(xCoordinate.toFixed(0), yCoordinate.toFixed(0));

		if (plane === "sagittal") {
			// setCoords({
			// 	z: xCoordinate.toFixed(0),
			// 	x: yCoordinate.toFixed(0),
			// 	y: undefined,
			// });

			calculateMriImages(
				plane,
				yCoordinate.toFixed(0),
				undefined,
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "coronal") {
			// setCoords({
			// 	z: xCoordinate.toFixed(0),
			// 	x: undefined,
			// 	y: yCoordinate.toFixed(0),
			// });

			calculateMriImages(
				plane,
				undefined,
				yCoordinate.toFixed(0),
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "axial") {
			// setCoords({
			// 	z: undefined,
			// 	x: xCoordinate.toFixed(0),
			// 	y: yCoordinate.toFixed(0),
			// });

			calculateMriImages(
				plane,
				xCoordinate.toFixed(0),
				yCoordinate.toFixed(0),
				undefined,
				mriSlices[plane]["slice"]
			);
		}
	};

	const getTopLeft = () => {
		if (plane === "sagittal") {
			return { top: +coords.x - 1, left: +coords.z - 1 };
		}
		if (plane === "coronal") {
			return { top: +coords.y - 1, left: +coords.z - 1 };
		}
		if (plane === "axial") {
			return { top: +coords.y - 1, left: +coords.x - 1 };
		}
	};

	console.log(coords);
	console.log(mriSlices[plane].targetTop);

	// useEffect(() => {
	// 	getTopLeft();
	// }, [coords]);

	return (
		<div className={`side-panel ${plane}`}>
			{/* <div>sagittal</div> */}
			<div className="img-container">
				<div
					className="target-pointer"
					style={{
						top: +mriSlices[plane].targetTop,
						left: +mriSlices[plane].targetLeft,
					}}
				></div>

				<img
					onClick={(e) => getCoords(e)}
					// onMouseEnter={() => enterTarget()}
					// onMouseLeave={() => leaveTarget()}
					// onMouseMove={(e) => mouseMove(e)}
					className={`${plane}-image`}
					src={mriImage}
					alt={`${plane}-image`}
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

export default MriPanel;
