import React, { useEffect, useState } from "react";

import MousePointer from "../../shared/MousePointer";

import "./MriImage.css";

const MriImage = (props) => {
	const [mriImage, setMriImage] = useState();
	const [currentSlice, setCurrentSlice] = useState();

	const { plane, mriImageCoords, computeMriImagesHandler } = props;

	console.log(mriImageCoords);

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		const paddedSlice = props.mriImageCoords[plane]["slice"]
			.toString()
			.padStart(3, 0);

		const mriImage =
			require(`../../../assets/P57-16/mri/slices_${plane}/slice_${paddedSlice}.png`).default;

		setCurrentSlice(paddedSlice);
		setMriImage(mriImage);
	}, [mriImageCoords]);

	return (
		<div className={`mri-img ${plane}`}>
			<div className={`mri-img-container ${plane}`}>
				<MousePointer type="mri" plane={plane} imageCoords={mriImageCoords} />

				<img
					onClick={(e) => computeMriImagesHandler(e)}
					className={`${plane}-img`}
					src={mriImage}
					alt={`${plane}-slice${currentSlice}`}
				></img>
			</div>
		</div>
	);
};

export default MriImage;
