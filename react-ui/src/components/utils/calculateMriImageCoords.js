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

	switch (currentPlane) {
		case "sagittal":
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
					slice: mriCoordinatesKey.sagittal.height - mouseY,
					mouseX: mriCoordinatesKey.sagittal.slices - currentSlice,
					mouseY: mriCoordinatesKey.sagittal.width - mouseX,
				},
			};
			break;
		case "coronal":
			newMriCoords = {
				sagittal: {
					slice: mriCoordinatesKey.coronal.width - mouseX,
					mouseX: currentSlice,
					mouseY: mouseY,
				},
				coronal: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
				axial: {
					slice: mriCoordinatesKey.coronal.height - mouseY,
					mouseX: mouseX,
					mouseY: mriCoordinatesKey.coronal.slices - currentSlice,
				},
			};
			break;
		case "axial":
			newMriCoords = {
				sagittal: {
					slice: mriCoordinatesKey.axial.width - mouseX,
					mouseX: mriCoordinatesKey.axial.height - mouseY,
					mouseY: mriCoordinatesKey.axial.slices - currentSlice,
				},
				coronal: {
					slice: mriCoordinatesKey.axial.height - mouseY,
					mouseX: mouseX,
					mouseY: mriCoordinatesKey.axial.slices - currentSlice,
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
