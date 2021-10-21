import { FC } from "react";

import MriImage from "./MriImage";
import getMouseCoords from "../../utils/getMouseCoords";

import { MriCoords } from "../../../models/mriCoords.model";
import { AtlasImagesDimensionsKey } from "../../../models/atlasImagesDimensionsKey.model";

interface Props {
	patientId: string;
	mriImageCoords: MriCoords | null;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	updateMriAndHistologyImages: (
		plane: string,
		currentSlice: number,
		mouseX: number,
		mouseY: number,
		patientId: string
	) => void;
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null;
}

const MriImages: FC<Props> = (props) => {
	const {
		patientId,
		mriImageCoords,
		showHiRes,
		setShowHiRes,
		updateMriAndHistologyImages,
		atlasImagesDimensionsKey,
	} = props;

	const computeMriImagesHandler = (
		e: React.MouseEvent<Element, MouseEvent>,
		plane: string
	) => {
		if (showHiRes) setShowHiRes(false);

		const tempShowHiRes = false; // avoid errors with application not catching up to latest state

		const { mouseX, mouseY } = getMouseCoords(e, tempShowHiRes);

		const mouseIsWithinBounds = determineMouseBoundariesMri(
			mouseX,
			mouseY,
			plane
		);

		if (!mouseIsWithinBounds) return;

		updateMriAndHistologyImages(
			plane,
			+mriImageCoords![plane]["slice"],
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
				mouseX > +atlasImagesDimensionsKey!.mriDimensions.sagittal.width - 1 ||
				mouseY > +atlasImagesDimensionsKey!.mriDimensions.sagittal.height - 1
			)
				return false;
		}

		if (plane === "coronal") {
			if (
				mouseX > +atlasImagesDimensionsKey!.mriDimensions.coronal.width - 1 ||
				mouseY > +atlasImagesDimensionsKey!.mriDimensions.coronal.height - 1
			)
				return false;
		}

		if (plane === "axial") {
			if (
				mouseX > +atlasImagesDimensionsKey!.mriDimensions.axial.width - 1 ||
				mouseY > +atlasImagesDimensionsKey!.mriDimensions.axial.height - 1
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
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>

			<MriImage
				plane="coronal"
				mriImageCoords={mriImageCoords}
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>

			<MriImage
				plane="axial"
				mriImageCoords={mriImageCoords}
				computeMriImagesHandler={computeMriImagesHandler}
				patientId={patientId}
			/>
		</>
	);
};

export default MriImages;
