import React from "react";

import "./MriPanel.css";

const MriPanel = (props) => {
	const { plane, mriSlices, calculateMriImages } = props;

	const paddedSlice = props.mriSlices[plane]["slice"].toString().padStart(3, 0);
	const mriImage = require(`../../../assets/mri/slices_${plane}/slice_${paddedSlice}.png`)
		.default;

	const getCoords = (e) => {
		const xCoordinate = e.nativeEvent.offsetX;
		const yCoordinate = e.nativeEvent.offsetY;

		if (plane === "sagittal") {
			calculateMriImages(
				plane,
				yCoordinate.toFixed(0),
				undefined,
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "coronal") {
			calculateMriImages(
				plane,
				undefined,
				yCoordinate.toFixed(0),
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "axial") {
			calculateMriImages(
				plane,
				xCoordinate.toFixed(0),
				yCoordinate.toFixed(0),
				undefined,
				mriSlices[plane]["slice"]
			);
		}
	};

	return (
		<div className={`side-panel ${plane}`}>
			<div>{plane}</div>
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

			<div>
				{Object.keys(mriSlices[plane]).map((prop, index) => (
					<React.Fragment key={index}>
						<div>
							<strong>{prop}: </strong>
							<strong>{mriSlices[plane][prop]} </strong>
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default MriPanel;
