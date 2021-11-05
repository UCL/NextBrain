// converts between hi-res and low-res versions of histology mouse coords

import { AtlasImagesDimensionsKey } from "../../models/atlasImagesDimensionsKey.model";

const convertHistologyMouseCoords = (
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null,
	currentHistologyMouseX: number,
	currentHistologyMouseY: number,
	currentHistologyBlock: number,
	showHiRes: boolean
) => {
	if (showHiRes) {
		// returns low res versions of mouseX and mouseY given hi-res versions
		const lowResMouseX =
			(+atlasImagesDimensionsKey!.histologyLowResDimensions[
				currentHistologyBlock
			].width /
				+atlasImagesDimensionsKey!.histologyHiResDimensions[
					currentHistologyBlock
				].width) *
			currentHistologyMouseX;

		const lowResMouseY =
			(+atlasImagesDimensionsKey!.histologyLowResDimensions[
				currentHistologyBlock
			].height /
				+atlasImagesDimensionsKey!.histologyHiResDimensions[
					currentHistologyBlock
				].height) *
			currentHistologyMouseY;

		return { lowResMouseX, lowResMouseY };
	}

	if (!showHiRes) {
		// returns hi res versions of mouseX and mouseY given low-res versions
		const hiResMouseX =
			(+atlasImagesDimensionsKey!.histologyHiResDimensions[
				currentHistologyBlock
			].width /
				+atlasImagesDimensionsKey!.histologyLowResDimensions[
					currentHistologyBlock
				].width) *
			currentHistologyMouseX;

		const hiResMouseY =
			(+atlasImagesDimensionsKey!.histologyHiResDimensions[
				currentHistologyBlock
			].height /
				+atlasImagesDimensionsKey!.histologyLowResDimensions[
					currentHistologyBlock
				].height) *
			currentHistologyMouseY;

		return { hiResMouseX, hiResMouseY };
	}

	// fallback coordinates to produce error
	return { mouseX: -1, mouseY: -1 };
};

export default convertHistologyMouseCoords;
