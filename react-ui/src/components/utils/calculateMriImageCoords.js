// coordinates are calculated specifically for each plane
// refer to the top level readme for guidance on how the coordinates are calculated

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
			};
			break;
	}

	return newMriCoords;
};

export default calculateMriImageCoords;
