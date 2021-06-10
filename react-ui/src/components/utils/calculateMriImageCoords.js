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
					slice: mouseY.toFixed(0),
					mouseX: mouseX * CORONAL_RESCALING_FACTOR,
					mouseY: currentSlice * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: mouseX.toFixed(0),
					mouseX: mouseY,
					mouseY: currentSlice,
				},
			};
			break;
		case "coronal":
			// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
			mouseX = mouseX / CORONAL_RESCALING_FACTOR;
			mouseY = mouseY / CORONAL_RESCALING_FACTOR;

			mouseX = Number(mouseX);
			mouseY = Number(mouseY);

			newMriCoords = {
				sagittal: {
					slice: mouseY.toFixed(0),
					mouseX: mouseX,
					mouseY: currentSlice,
				},
				coronal: {
					slice: currentSlice,
					mouseX: mouseX * CORONAL_RESCALING_FACTOR,
					mouseY: mouseY * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: mouseX.toFixed(0),
					mouseX: currentSlice,
					mouseY: mouseY,
				},
			};
			break;
		case "axial":
			newMriCoords = {
				sagittal: {
					slice: mouseY.toFixed(0),
					mouseX: currentSlice,
					mouseY: mouseX,
				},
				coronal: {
					slice: mouseX.toFixed(0),
					mouseX: currentSlice * CORONAL_RESCALING_FACTOR,
					mouseY: mouseY * CORONAL_RESCALING_FACTOR,
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
