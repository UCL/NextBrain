import { FC, useEffect, useState } from "react";

import ErrorModal from "../../shared/ErrorModal";
import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import MousePointer from "../../shared/MousePointer";

import { MriCoords } from "../../../models/mriCoords.model";

import "./MriImage.css";

interface Props {
	plane: string;
	mriImageCoords: MriCoords | null;
	showHiRes: boolean;
	computeMriImagesHandler: (
		e: React.MouseEvent<Element, MouseEvent>,
		plane: string
	) => void;
}

const MriImage: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>();
	const [mriImage, setMriImage] = useState("");
	const [currentSlice, setCurrentSlice] = useState("");

	const { plane, mriImageCoords, showHiRes, computeMriImagesHandler } = props;

	useEffect(() => {
		preloadMriImages();
	}, []);

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		// is toString() necessary here?
		const paddedSlice = mriImageCoords![plane]?.slice
			.toFixed(0)
			.toString()
			.padStart(3, "0");

		try {
			const mriImage =
				require(`../../../assets/P57-16/mri_rotated/slices_${plane}_webp/slice_${paddedSlice}.webp`).default;

			setMriImage(mriImage);
			setCurrentSlice(paddedSlice);
		} catch {
			console.log(
				`%cerror, could not resolve path: assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`,
				"color: red"
			);
		}
	}, [mriImageCoords, plane]);

	// used for loading all images at page load and adding them to the cache for quicker subsequent loading
	const preloadMriImages = () => {
		console.log("preloading all mri images");

		// preload all mri images
		const limit = mriCoordinatesKey[plane]["slices"];

		setError(null);
		//setIsLoading(true);

		for (let i = 0; i < limit; i++) {
			const paddedSlice = i.toFixed(0).toString().padStart(3, "0");

			const img = new Image();

			try {
				const mriImage =
					require(`../../../assets/P57-16/mri_rotated/slices_${plane}_webp/slice_${paddedSlice}.webp`).default;

				console.log(mriImage);

				img.src = mriImage;
			} catch {
				console.log(
					`%cerror, could not resolve path: assets/P57-16/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`,
					"color: red"
				);
			}
		}

		//setIsLoading(false);
	};

	if (mriImage === null || currentSlice === null) {
		return <div>Could not build mri image</div>;
	}

	return (
		<>
			<ErrorModal error={error!} onClear={() => setError(null)} />

			<div className={`mri-img ${plane}`}>
				<div className={`mri-img-container ${plane}`}>
					<MousePointer
						mouseY={mriImageCoords![plane].mouseY}
						mouseX={mriImageCoords![plane].mouseX}
					/>

					<img
						onClick={
							!showHiRes
								? (e) => computeMriImagesHandler(e, plane)
								: () => setError("Cannot navigate while in hi-res mode")
						}
						// onWheel={(e) => console.log(e)}
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
