import React, { useState, useEffect } from "react";

import MousePointer from "../../shared/MousePointer";

import "./HistologyImage.css";

const HistologyImage = (props) => {
	const [histologyImage, setHistologyImage] = useState(null);

	const { histologyImageCoords, channel, histologyToMri } = props;

	useEffect(() => {
		// determine the correct histology image based on computed coordinates
		if (histologyImageCoords !== null && histologyImageCoords !== undefined) {
			const paddedBlock = histologyImageCoords["currentBlock"]
				.toString()
				.padStart(2, 0);
			//console.log(paddedBlock);

			const histologySlice = histologyImageCoords.coords["slice"];
			const paddedSlice = histologySlice.toString().padStart(2, 0);

			try {
				const histologyImage =
					require(`../../../assets/P57-16/histology/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`).default;
				setHistologyImage(histologyImage);
			} catch {
				console.log(
					`%cerror, could not resolve path: assets/P57-16/histology/${paddedBlock}/slices_${channel}/slice_${paddedSlice}.jpg`,
					"color: red"
				);
			}
		}
	}, [histologyImageCoords, channel]);

	if (histologyImage === null) {
		return <div>Could not build histology image</div>;
	}

	return (
		<div className="histology-img histology">
			<div className={`histology-img-container`}>
				<MousePointer type="histology" imageCoords={histologyImageCoords} />

				<img
					onClick={(e) => histologyToMri(e)}
					className="histology-img"
					src={histologyImage}
					alt="histology"
				></img>
			</div>
		</div>
	);
};

export default HistologyImage;
