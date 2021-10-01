// this function is just for debugging purposes
// it logs the mapping of the physical currentMriMouseX, currentMriMouseY, and slice coordinates in the web app to the x y z coords of ITKSnap
// I add +1 to each ITKSnap coord because the index for ITKSnap starts at 1

const logMriCoordsForDebugging = (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number,
	adjustedMriSlice: number,
	adjustedMriMouseX: number,
	adjustedMriMouseY: number
) => {
	console.log(`current plane: ${currentMriPlane}`);

	if (currentMriPlane === "sagittal") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${currentMriSlice}, currentMriMouseX = ${currentMriMouseX}, currentMriMouseY = ${currentMriMouseY}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${currentMriMouseX}, currentMriMouseX = ${adjustedMriSlice}, currentMriMouseY = ${currentMriMouseY}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${adjustedMriMouseY}, currentMriMouseX = ${adjustedMriSlice}, currentMriMouseY = ${adjustedMriMouseX}`
		);
		console.log(
			`logging ITKSnap coords: X = ${currentMriSlice + 1}, Y = ${
				currentMriMouseX + 1
			}, Z = ${adjustedMriMouseY + 1}`
		);
	}

	if (currentMriPlane === "coronal") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${adjustedMriMouseX}, currentMriMouseX = ${currentMriSlice}, currentMriMouseY = ${currentMriMouseY}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${currentMriSlice}, currentMriMouseX = ${currentMriMouseX}, currentMriMouseY = ${currentMriMouseY}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${adjustedMriMouseY}, currentMriMouseX = ${currentMriMouseX}, currentMriMouseY = ${adjustedMriSlice}`
		);

		console.log(
			`logging ITKSnap coords: x = ${adjustedMriMouseX + 1}, y = ${
				currentMriSlice + 1
			}, z = ${adjustedMriMouseY + 1}`
		);
	}

	if (currentMriPlane === "axial") {
		console.log(
			`logging chosen web coords for sagittal: slice = ${adjustedMriMouseX}, currentMriMouseX = ${adjustedMriMouseY}, currentMriMouseY = ${adjustedMriSlice}`
		);
		console.log(
			`logging chosen web coords for coronal: slice = ${adjustedMriMouseY}, currentMriMouseX = ${currentMriMouseX}, currentMriMouseY = ${adjustedMriSlice}`
		);
		console.log(
			`logging chosen web coords for axial: slice = ${currentMriSlice}, currentMriMouseX = ${currentMriMouseX}, currentMriMouseY = ${currentMriMouseY}`
		);

		console.log(
			`logging ITKSnap coords: x = ${adjustedMriMouseX + 1}, y = ${
				adjustedMriMouseY + 1
			}, z = ${currentMriSlice + 1}`
		);
	}
};

export default logMriCoordsForDebugging;
