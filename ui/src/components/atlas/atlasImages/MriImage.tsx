import { FC, useEffect, useState } from "react";

import ErrorModal from "../../shared/ErrorModal";
import MousePointer from "../../shared/MousePointer";

import { MriCoords } from "../../../models/mriCoords.model";

import "./MriImage.css";

interface Props {
	baseAssetsUrl: string;
	patientId: string;
	plane: string;
	mriImageCoords: MriCoords | null;
	computeMriImagesHandler: (
		e: React.MouseEvent<Element, MouseEvent>,
		plane: string
	) => void;
}

const MriImage: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>();
	const [mriImage, setMriImage] = useState("");
	const [currentSlice, setCurrentSlice] = useState("");

	const {
		baseAssetsUrl,
		patientId,
		plane,
		mriImageCoords,
		computeMriImagesHandler,
	} = props;

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		const paddedSlice = mriImageCoords![plane]?.slice
			.toFixed(0)
			.padStart(3, "0");

		try {
			const mriImage = `${baseAssetsUrl}${patientId}/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`;

			setMriImage(mriImage);
			setCurrentSlice(paddedSlice);
		} catch (e) {
			console.log(
				`%cerror, could not load mri image, ${e},
				"color: red"`
			);
		}
	}, [mriImageCoords, plane, patientId, baseAssetsUrl]);

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
						onClick={(e) => computeMriImagesHandler(e, plane)}
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
