import mriCoordinatesKey from "./mriCoordinatesKey";

const calculateAdjustedMouseCoords = (
	currentPlane: string,
	currentSlice: number,
	mouseX: number,
	mouseY: number
) => {
	// adjusting coordinates to account for images not being in the correct orientations
	// in other words, I have to account for orientation differences between the web application and ITKSnap
	// specifically, ITKSnap has the 0,0 coordinate at the bottom right, whereas the web application has 0,0 at the top left

	let adjustedSlice;
	let adjustedMouseX;
	let adjustedMouseY;

	if (currentPlane === "sagittal") {
		adjustedSlice = mriCoordinatesKey.sagittal.slices - currentSlice;
		adjustedMouseX = mriCoordinatesKey.sagittal.width - mouseX;
		adjustedMouseY = mriCoordinatesKey.sagittal.height - mouseY;
	}

	if (currentPlane === "coronal") {
		adjustedSlice = mriCoordinatesKey.coronal.slices - currentSlice;
		adjustedMouseX = mriCoordinatesKey.coronal.width - mouseX;
		adjustedMouseY = mriCoordinatesKey.coronal.height - mouseY;
	}

	if (currentPlane === "axial") {
		adjustedSlice = mriCoordinatesKey.axial.slices - currentSlice;
		adjustedMouseX = mriCoordinatesKey.axial.width - mouseX;
		adjustedMouseY = mriCoordinatesKey.axial.height - mouseY;
	}

	return { adjustedSlice, adjustedMouseX, adjustedMouseY };
};

export default calculateAdjustedMouseCoords;
