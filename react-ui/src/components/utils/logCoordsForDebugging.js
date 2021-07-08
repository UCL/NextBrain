// this function is just for debugging purposes
// it logs the mapping of the physical mouseX and mouseY coordinates in the web app to the x y z coords of ITKSnap

const logCoordsForDebugging = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedMouseX,
	adjustedMouseY,
	adjustedSlice
) => {
	console.log(`current plane: ${currentPlane}`);

	if (currentPlane === "sagittal") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${currentSlice}, mouseX = ${mouseX}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${mouseX}, mouseX = ${currentSlice}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${adjustedMouseY}, mouseX = ${adjustedSlice}, mouseY = ${adjustedMouseX}`
		);
		console.log(
			`logging ITKSnap coords: X = ${currentSlice}, Y = ${mouseX}, Z = ${adjustedMouseY}`
		);
	}

	if (currentPlane === "coronal") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${adjustedMouseX}, mouseX = ${currentSlice}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${currentSlice}, mouseX = ${mouseX}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${adjustedMouseY}, mouseX = ${mouseX}, mouseY = ${adjustedSlice}`
		);

		console.log(
			`logging ITKSnap coords: x = ${adjustedMouseX}, y = ${currentSlice}, z = ${adjustedMouseY}`
		);
	}

	if (currentPlane === "axial") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${adjustedMouseX}, mouseX = ${adjustedMouseY}, mouseY = ${adjustedSlice}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${adjustedMouseY}, mouseX = ${mouseX}, mouseY = ${adjustedSlice}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${currentSlice}, mouseX = ${mouseX}, mouseY = ${mouseY}`
		);

		console.log(
			`logging ITKSnap coords: x = ${adjustedMouseX}, y = ${adjustedMouseY}, z = ${currentSlice}`
		);
	}
};

export default logCoordsForDebugging;
