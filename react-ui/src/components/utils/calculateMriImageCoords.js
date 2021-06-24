import mriCoordinatesKey from "./mriCoordinatesKey";

const calculateMriImageCoords = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY
) => {
	let newMriCoords;

	// console.log(mouseX, mouseY);
	// console.log(mouseX.toFixed(0), mouseY.toFixed(0));

	let adjustedMouseY;
	let adjustedSlice;
	let adjustedMouseX;

	switch (currentPlane) {
		case "sagittal":
			//adjusting coordinates to account for images not being in the right orientations
			adjustedMouseX = mriCoordinatesKey.sagittal.width - mouseX;
			adjustedMouseY = mriCoordinatesKey.sagittal.height - mouseY;
			adjustedSlice = mriCoordinatesKey.sagittal.slices - currentSlice;

			newMriCoords = {
				sagittal: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
				coronal: {
					slice: mouseX,
					mouseX: currentSlice,
					mouseY: mouseY,
				},
				axial: {
					slice: adjustedMouseY,
					mouseX: adjustedSlice,
					mouseY: adjustedMouseX,
				},
			};
			break;
		case "coronal":
			adjustedMouseX = mriCoordinatesKey.coronal.width - mouseX;
			adjustedMouseY = mriCoordinatesKey.coronal.height - mouseY;
			adjustedSlice = mriCoordinatesKey.coronal.slices - currentSlice;

			newMriCoords = {
				sagittal: {
					slice: adjustedMouseX,
					mouseX: currentSlice,
					mouseY: mouseY,
				},
				coronal: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
				axial: {
					slice: adjustedMouseY,
					mouseX: mouseX,
					mouseY: adjustedSlice,
				},
			};
			break;
		case "axial":
			adjustedMouseX = mriCoordinatesKey.axial.width - mouseX;
			adjustedMouseY = mriCoordinatesKey.axial.height - mouseY;
			adjustedSlice = mriCoordinatesKey.axial.slices - currentSlice;

			newMriCoords = {
				sagittal: {
					slice: adjustedMouseX,
					mouseX: adjustedMouseY,
					mouseY: adjustedSlice,
				},
				coronal: {
					slice: adjustedMouseY,
					mouseX: mouseX,
					mouseY: adjustedSlice,
				},
				axial: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
			};
			break;
	}

	return newMriCoords;
};

export default calculateMriImageCoords;
