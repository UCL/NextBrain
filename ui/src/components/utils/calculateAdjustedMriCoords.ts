import { AtlasImagesDimensionsKey } from "../../models/atlasImagesDimensionsKey.model";

const calculateAdjustedMriCoords = (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number,
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null
) => {
	// adjusting coordinates to account for images not being in the correct orientations
	// in other words, I have to account for orientation differences between the web application and ITKSnap
	// specifically, ITKSnap has the 0,0 coordinate at the bottom right, whereas the web application has 0,0 at the top left

	let adjustedMriSlice;
	let adjustedMriMouseX;
	let adjustedMriMouseY;

	if (currentMriPlane === "sagittal") {
		adjustedMriSlice =
			+atlasImagesDimensionsKey!.mriDimensions.sagittal.slices -
			currentMriSlice;
		adjustedMriMouseX =
			+atlasImagesDimensionsKey!.mriDimensions.sagittal.width -
			currentMriMouseX;
		adjustedMriMouseY =
			+atlasImagesDimensionsKey!.mriDimensions.sagittal.height -
			currentMriMouseY;
	}

	if (currentMriPlane === "coronal") {
		adjustedMriSlice =
			+atlasImagesDimensionsKey!.mriDimensions.coronal.slices - currentMriSlice;
		adjustedMriMouseX =
			+atlasImagesDimensionsKey!.mriDimensions.coronal.width - currentMriMouseX;
		adjustedMriMouseY =
			+atlasImagesDimensionsKey!.mriDimensions.coronal.height -
			currentMriMouseY;
	}

	if (currentMriPlane === "axial") {
		adjustedMriSlice =
			+atlasImagesDimensionsKey!.mriDimensions.axial.slices - currentMriSlice;
		adjustedMriMouseX =
			+atlasImagesDimensionsKey!.mriDimensions.axial.width - currentMriMouseX;
		adjustedMriMouseY =
			+atlasImagesDimensionsKey!.mriDimensions.axial.height - currentMriMouseY;
	}

	return { adjustedMriSlice, adjustedMriMouseX, adjustedMriMouseY };
};

export default calculateAdjustedMriCoords;
