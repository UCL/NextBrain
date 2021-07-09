import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal";
import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import MousePointer from "../../shared/MousePointer";

import "./MriImage.css";

const MriImage = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mriImage, setMriImage] = useState(null);
	const [currentSlice, setCurrentSlice] = useState(null);

	const { plane, mriImageCoords, computeMriImagesHandler } = props;

	//console.log(mriImageCoords);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		// preloadMriImages();
	}, []);

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		const paddedSlice = props.mriImageCoords[plane]["slice"]
			.toFixed(0)
			.toString()
			.padStart(3, 0);

		try {
			const mriImage =
				require(`../../../assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`).default;

			setMriImage(mriImage);
			setCurrentSlice(paddedSlice);
		} catch {
			console.log(
				`%cerror, could not resolve path: assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`,
				"color: red"
			);
		}
	}, [mriImageCoords]);

	const preloadMriImages = () => {
		// preload all mri images
		const limit = mriCoordinatesKey[plane]["slices"];

		setError(null);
		setIsLoading(true);

		for (let i = 0; i < limit; i++) {
			const paddedSlice = i.toFixed(0).toString().padStart(3, 0);

			const img = new Image();

			try {
				const mriImage =
					require(`../../../assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`).default;

				console.log(mriImage);

				img.src = mriImage;
			} catch {
				console.log(
					`%cerror, could not resolve path: assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`,
					"color: red"
				);
			}
		}

		setIsLoading(false);
	};

	if (mriImage === null || currentSlice === null) {
		return <div>Could not build mri image</div>;
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
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
		</>
	);
};

export default MriImage;
