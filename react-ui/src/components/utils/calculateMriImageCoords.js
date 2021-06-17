import CORONAL_RESCALING_FACTOR from "./CoronalRescalingFactor";

const calculateMriImageCoords = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY
) => {
	let newMriCoords;

	console.log(mouseX, mouseY);
	console.log(mouseX.toFixed(0), mouseY.toFixed(0));

	switch (currentPlane) {
		case "sagittal":
			newMriCoords = {
				sagittal: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
				coronal: {
					slice: mouseY,
					mouseX: mouseX,
					mouseY: currentSlice,
				},
				axial: {
					slice: mouseX,
					mouseX: mouseY,
					mouseY: currentSlice,
				},
			};
			break;
		case "coronal":
			// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
			// mouseX = mouseX / CORONAL_RESCALING_FACTOR;
			// mouseY = mouseY / CORONAL_RESCALING_FACTOR;

			// mouseX = Number(mouseX);
			// mouseY = Number(mouseY);

			newMriCoords = {
				sagittal: {
					slice: mouseY,
					mouseX: mouseX,
					mouseY: currentSlice,
				},
				coronal: {
					slice: currentSlice,
					mouseX: mouseX,
					mouseY: mouseY,
				},
				axial: {
					slice: mouseX,
					mouseX: currentSlice,
					mouseY: mouseY,
				},
			};
			break;
		case "axial":
			newMriCoords = {
				sagittal: {
					slice: mouseY,
					mouseX: currentSlice,
					mouseY: mouseX,
				},
				coronal: {
					slice: mouseX,
					mouseX: currentSlice,
					mouseY: mouseY,
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
