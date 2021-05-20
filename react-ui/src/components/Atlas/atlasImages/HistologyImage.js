import React, { useState, useEffect } from "react";

import MousePointer from "../../shared/MousePointer";

import "./HistologyImage.css";

const HistologyImage = (props) => {
	const [histologyImage, setHistologyImage] = useState();

	const { histologyImages } = props;

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		const histologyImage = require(`../../../assets/slice_00.jpg`).default;

		setHistologyImage(histologyImage);
	}, [histologyImages]);

	return (
		<div className="histology-img histology">
			<div className={`histology-img-container`}>
				<MousePointer type="histology" />

				<img
					// onClick={(e) => computeMriImagesHandler(e)}
					// className={`${plane}-img`}
					src={histologyImage}
					//alt={`${plane}-img`}
				></img>
			</div>
		</div>
	);
};

export default HistologyImage;
