const calculateMriImageCoords = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY
) => {
	let newMriCoords;

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
					mouseX: adjustedSlice,
					mouseY: mouseY,
				},
				axial: {
					slice: adjustedMouseY,
					mouseX: adjustedSlice,
					mouseY: adjustedMouseX,
				},
				currentPlane: currentPlane,
			};
			break;
		case "coronal":
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
				currentPlane: currentPlane,
			};
			break;
		case "axial":
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
				currentPlane: currentPlane,
			};
			break;
	}

	return newMriCoords;
};

export default calculateMriImageCoords;
