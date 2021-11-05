// coordinates are calculated specifically for each plane
// refer to the top level readme for guidance on how the coordinates are calculated
// adjusted coords are used to account for coordinate space differences between the web app and ITKSnap

const calculateMriImageCoords = (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number,
	adjustedMriSlice: number,
	adjustedMriMouseX: number,
	adjustedMriMouseY: number
) => {
	let newMriCoords;

	switch (currentMriPlane) {
		case "sagittal":
			newMriCoords = {
				sagittal: {
					slice: currentMriSlice,
					mouseX: currentMriMouseX,
					mouseY: currentMriMouseY,
				},
				coronal: {
					slice: currentMriMouseX,
					mouseX: adjustedMriSlice,
					mouseY: currentMriMouseY,
				},
				axial: {
					slice: adjustedMriMouseY,
					mouseX: adjustedMriSlice,
					mouseY: adjustedMriMouseX,
				},
			};
			break;
		case "coronal":
			newMriCoords = {
				sagittal: {
					slice: adjustedMriMouseX,
					mouseX: currentMriSlice,
					mouseY: currentMriMouseY,
				},
				coronal: {
					slice: currentMriSlice,
					mouseX: currentMriMouseX,
					mouseY: currentMriMouseY,
				},
				axial: {
					slice: adjustedMriMouseY,
					mouseX: currentMriMouseX,
					mouseY: adjustedMriSlice,
				},
			};
			break;
		case "axial":
			newMriCoords = {
				sagittal: {
					slice: adjustedMriMouseX,
					mouseX: adjustedMriMouseY,
					mouseY: adjustedMriSlice,
				},
				coronal: {
					slice: adjustedMriMouseY,
					mouseX: currentMriMouseX,
					mouseY: adjustedMriSlice,
				},
				axial: {
					slice: currentMriSlice,
					mouseX: currentMriMouseX,
					mouseY: currentMriMouseY,
				},
			};
			break;
		default:
			newMriCoords = undefined;
	}

	return newMriCoords;
};

export default calculateMriImageCoords;
