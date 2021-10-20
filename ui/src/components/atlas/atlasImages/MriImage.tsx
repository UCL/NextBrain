import { FC, useEffect, useState } from "react";

import { ASSETS_URL } from "../../utils/ASSETS_URL";
import ErrorModal from "../../shared/ErrorModal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import MousePointer from "../../shared/MousePointer";

import { MriCoords } from "../../../models/mriCoords.model";

import "./MriImage.css";

interface Props {
	patientId: string;
	plane: string;
	mriImageCoords: MriCoords | null;
	computeMriImagesHandler: (
		e: React.MouseEvent<Element, MouseEvent>,
		plane: string
	) => void;
}

const MriImage: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mriImage, setMriImage] = useState("");
	const [currentSlice, setCurrentSlice] = useState("");

	const { patientId, plane, mriImageCoords, computeMriImagesHandler } = props;

	useEffect(() => {
		// determine the correct mri image based on computed coordinates

		const paddedSlice = mriImageCoords![plane]?.slice
			.toFixed(0)
			.padStart(3, "0");

		setCurrentSlice(paddedSlice);

		const getMriImage = async () => {
			try {
				setIsLoading(true);
				const mriImageUrl = `${ASSETS_URL}${patientId}/mri_rotated/slices_${plane}/slice_${paddedSlice}.png`;

				// fetch the image from the server so we can utilise await and show a loading spinner
				// in reality we don't use the fetched data, we use the raw url in mriImageUrl
				const response = await fetch(mriImageUrl);

				if (response.ok) {
					setMriImage(mriImageUrl);
				}
			} catch (e) {
				setError("Error, could not load mri image");
				console.log(e);
			}
			setIsLoading(false);
		};

		getMriImage();
	}, [mriImageCoords, plane, patientId]);

	if (mriImage == null || mriImage === "" || currentSlice == null) {
		return (
			<>
				<ErrorModal error={error} onClear={() => setError(null)} />
				{isLoading && <LoadingSpinner asOverlay />}
				{!isLoading && <div>Failed to load mri image</div>}
			</>
		);
	}

	return (
		<>
			<ErrorModal error={error} onClear={() => setError(null)} />
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
