import React, { useState, useEffect } from "react";

import MousePointer from "../../shared/MousePointer";

import "./HistologyImage.css";

const HistologyImage = (props) => {
	const [histologyImage, setHistologyImage] = useState();

	const { histologyImageCoords } = props;

	useEffect(() => {
		// determine the correct mri image based on computed coordinates
		console.log(histologyImageCoords);
		if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
			console.log(histologyImageCoords.coords);

			const paddedBlock = histologyImageCoords["currentBlock"]
				.toString()
				.padStart(2, 0);
			console.log(paddedBlock);

			const histologySlice = histologyImageCoords.coords[2].toFixed(0);
			const paddedSlice = histologySlice.toString().padStart(2, 0);
			console.log(histologySlice);

			const histologyImage =
				require(`../../../assets/P57-16/histology/${paddedBlock}/slices_HE/slice_${paddedSlice}.jpg`).default;

			setHistologyImage(histologyImage);
		}
	}, [histologyImageCoords]);

	return (
		<div className="histology-img histology">
			<div className={`histology-img-container`}>
				<MousePointer type="histology" imageCoords={histologyImageCoords} />

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
