import React, { useState } from "react";

import "./MriPanel.css";

const MriPanel = (props) => {
	const { plane, mriSlices, calculateMriImages, mriDimensions } = props;

	const paddedSlice = props.mriSlices[plane]["slice"].toString().padStart(3, 0);
	const mriImage = require(`../../../assets/mri/slices_${plane}/slice_${paddedSlice}.png`)
		.default;

	const getCoords = (e) => {
		const xCoordinate = e.nativeEvent.offsetX;
		const yCoordinate = e.nativeEvent.offsetY;

		// console.log(xCoordinate, yCoordinate);

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
			{/* <div className="debug-info">
				<div>{plane}</div>
				<div>
					{Object.keys(mriSlices[plane]).map((prop, index) => (
						<React.Fragment key={index}>
							<div>
								<strong>{prop}: </strong>
								<strong>{mriSlices[plane][prop]} </strong>
							</div>
						</React.Fragment>
					))}
					{Object.keys(mriDimensions[plane]).map((prop, index) => (
						<React.Fragment key={index}>
							<div>
								<strong>{prop}: </strong>
								<strong>{mriDimensions[plane][prop]} </strong>
							</div>
						</React.Fragment>
					))}
				</div>
			</div> */}

			<div className={`img-container ${plane}`}>
				<div
					className="target-pointer"
					style={{
						top: +mriSlices[plane].targetTop,
						left: +mriSlices[plane].targetLeft,
					}}
				></div>

				<img
					onClick={(e) => getCoords(e)}
					className={`${plane}-img`}
					src={mriImage}
					alt={`${plane}-img`}
				></img>
			</div>
		</div>
	);
};

export default MriPanel;
