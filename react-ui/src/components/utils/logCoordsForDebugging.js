// this function is just for debugging purposes
// it logs the mapping of the physical mouseX and mouseY coordinates in the web app to the x y z coords of ITKSnap
// I add +1 to each ITKSnap coord because the index for ITKSnap starts at 1

const logCoordsForDebugging = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY
) => {
	console.log(`current plane: ${currentPlane}`);

	if (currentPlane === "sagittal") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${currentSlice}, mouseX = ${mouseX}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${mouseX}, mouseX = ${adjustedSlice}, mouseY = ${mouseY}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${adjustedMouseY}, mouseX = ${adjustedSlice}, mouseY = ${adjustedMouseX}`
		);
		console.log(
			`logging ITKSnap coords: X = ${currentSlice + 1}, Y = ${
				mouseX + 1
			}, Z = ${adjustedMouseY + 1}`
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
			`logging ITKSnap coords: x = ${adjustedMouseX + 1}, y = ${
				currentSlice + 1
			}, z = ${adjustedMouseY + 1}`
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
			`logging ITKSnap coords: x = ${adjustedMouseX + 1}, y = ${
				adjustedMouseY + 1
			}, z = ${currentSlice + 1}`
		);
	}
};

export default logCoordsForDebugging;
