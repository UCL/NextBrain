import MriImage from "./MriImage";

import mriCoordinatesKey from "../../utils/mriCoordinatesKey";

import "./MriImages.css";

const MriImages = (props) => {
	const { plane, mriImageCoords, updateAtlasImages, coronalRescalingFactor } =
		props;

	const computeMriImagesHandler = (e) => {
		const { mouseX, mouseY } = getMouseCoords(e);
		const mouseIsWithinBounds = determineMouseBoundaries(mouseX, mouseY);

		if (!mouseIsWithinBounds) return;

		updateAtlasImages(plane, mriImageCoords[plane]["slice"], mouseX, mouseY);
	};

	const getMouseCoords = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;

		return { mouseX, mouseY };
	};

	const determineMouseBoundaries = (mouseX, mouseY) => {
		if (mouseX < 0 || mouseY < 0) return false;

		if (plane === "sagittal") {
			if (
				mouseX > mriCoordinatesKey.sagittal.width - 1 ||
				mouseY > mriCoordinatesKey.sagittal.height - 1
			)
				return false;
		}

		if (plane === "coronal") {
			// account for coronal rescaling
			if (
				mouseX >
					(mriCoordinatesKey.coronal.width - 1) * coronalRescalingFactor ||
				mouseY > (mriCoordinatesKey.coronal.height - 1) * coronalRescalingFactor
			)
				return false;
		}

		if (plane === "axial") {
			if (
				mouseX > mriCoordinatesKey.axial.width - 1 ||
				mouseY > mriCoordinatesKey.axial.height - 1
			)
				return false;
		}

		return true;
	};

	return (
		<MriImage
			plane={plane}
			mriImageCoords={mriImageCoords}
			computeMriImagesHandler={computeMriImagesHandler}
		/>
	);
};

export default MriImages;
