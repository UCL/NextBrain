import { FC } from "react";

import MriImage from "./MriImage";
import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import getMouseCoords from "../../utils/getmouseCoords";

import { MriCoords } from "../../../models/mriCoords.model";

interface Props {
	patientId: string;
	mriImageCoords: MriCoords | null;
	showHiRes: boolean;
	updateAtlasImages: (
		plane: string,
		currentSlice: number,
		mouseX: number,
		mouseY: number,
		patientId: string
	) => void;
}

const MriImages: FC<Props> = (props) => {
	const { patientId, mriImageCoords, showHiRes, updateAtlasImages } = props;

	const computeMriImagesHandler = (
		e: React.MouseEvent<Element, MouseEvent>,
		plane: string
	) => {
		if (showHiRes) return;

		const { mouseX, mouseY } = getMouseCoords(e);
		const mouseIsWithinBounds = determineMouseBoundariesMri(
			mouseX,
			mouseY,
			plane
		);

		if (!mouseIsWithinBounds) return;

		updateAtlasImages(
			plane,
			mriImageCoords![plane]["slice"],
			mouseX,
			mouseY,
			patientId
		);
	};

	const determineMouseBoundariesMri = (
		mouseX: number,
		mouseY: number,
		plane: string
	) => {
		if (mouseX < 0 || mouseY < 0) return false;

		if (plane === "sagittal") {
			if (
				mouseX > +mriCoordinatesKey.sagittal.width - 1 ||
				mouseY > +mriCoordinatesKey.sagittal.height - 1
			)
				return false;
		}

		if (plane === "coronal") {
			// account for coronal rescaling
			if (
				mouseX > +mriCoordinatesKey.coronal.width - 1 ||
				mouseY > +mriCoordinatesKey.coronal.height - 1
			)
				return false;
		}

		if (plane === "axial") {
			if (
				mouseX > +mriCoordinatesKey.axial.width - 1 ||
				mouseY > +mriCoordinatesKey.axial.height - 1
			)
				return false;
		}

		return true;
	};

	return (
		<>
			{/* too much repetition here, use map to loop through components? */}
			<MriImage
				plane="sagittal"
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>

			<MriImage
				plane="coronal"
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>

			<MriImage
				plane="axial"
				mriImageCoords={mriImageCoords}
				showHiRes={showHiRes}
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>
		</>
	);
};

export default MriImages;
