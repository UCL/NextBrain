import mriCoordinatesKey from "./mriCoordinatesKey";

const calculateAdjustedMriCoords = (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number
) => {
	// adjusting coordinates to account for images not being in the correct orientations
	// in other words, I have to account for orientation differences between the web application and ITKSnap
	// specifically, ITKSnap has the 0,0 coordinate at the bottom right, whereas the web application has 0,0 at the top left

	let adjustedMriSlice;
	let adjustedMriMouseX;
	let adjustedMriMouseY;

	if (currentMriPlane === "sagittal") {
		adjustedMriSlice = +mriCoordinatesKey.sagittal.slices - currentMriSlice;
		adjustedMriMouseX = +mriCoordinatesKey.sagittal.width - currentMriMouseX;
		adjustedMriMouseY = +mriCoordinatesKey.sagittal.height - currentMriMouseY;
	}

	if (currentMriPlane === "coronal") {
		adjustedMriSlice = +mriCoordinatesKey.coronal.slices - currentMriSlice;
		adjustedMriMouseX = +mriCoordinatesKey.coronal.width - currentMriMouseX;
		adjustedMriMouseY = +mriCoordinatesKey.coronal.height - currentMriMouseY;
	}

	if (currentMriPlane === "axial") {
		adjustedMriSlice = +mriCoordinatesKey.axial.slices - currentMriSlice;
		adjustedMriMouseX = +mriCoordinatesKey.axial.width - currentMriMouseX;
		adjustedMriMouseY = +mriCoordinatesKey.axial.height - currentMriMouseY;
	}

	return { adjustedMriSlice, adjustedMriMouseX, adjustedMriMouseY };
};

export default calculateAdjustedMriCoords;
