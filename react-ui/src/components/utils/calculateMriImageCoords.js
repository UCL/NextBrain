import CORONAL_RESCALING_FACTOR from "./CoronalRescalingFactor";

const calculateMriImageCoords = (
	currentPlane,
	currentSlice,
	axisX,
	axisY,
	axisZ
) => {
	let newMriCoords;

	switch (currentPlane) {
		case "sagittal":
			newMriCoords = {
				sagittal: {
					slice: currentSlice,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisZ,
					mouseY: axisX,
				},
				coronal: {
					slice: axisX,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisZ * CORONAL_RESCALING_FACTOR,
					mouseY: currentSlice * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: axisZ,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisX,
					mouseY: currentSlice,
				},
			};
			break;
		case "coronal":
			// a further adjustment of the coordinates is necessary to account for the rescaling of coronal image
			axisY = (axisY / CORONAL_RESCALING_FACTOR).toFixed(0);
			axisZ = (axisZ / CORONAL_RESCALING_FACTOR).toFixed(0);

			axisY = Number(axisY);
			axisZ = Number(axisZ);

			newMriCoords = {
				sagittal: {
					slice: axisY,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisZ,
					mouseY: currentSlice,
				},
				coronal: {
					slice: currentSlice,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisZ * CORONAL_RESCALING_FACTOR,
					mouseY: axisY * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: axisZ,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: currentSlice,
					mouseY: axisY,
				},
			};
			break;
		case "axial":
			newMriCoords = {
				sagittal: {
					slice: axisY,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: currentSlice,
					mouseY: axisX,
				},
				coronal: {
					slice: axisX,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: currentSlice * CORONAL_RESCALING_FACTOR,
					mouseY: axisY * CORONAL_RESCALING_FACTOR,
				},
				axial: {
					slice: currentSlice,
					axisX: axisX,
					axisY: axisY,
					axisZ: axisZ,
					mouseX: axisX,
					mouseY: axisY,
				},
			};
			break;
	}

	return newMriCoords;
};

export default calculateMriImageCoords;
