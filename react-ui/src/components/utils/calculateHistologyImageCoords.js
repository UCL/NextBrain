import npyjs from "npyjs";
import ndarray from "ndarray";

import txtToArray from "./txtToArray";
import matrixMultiplier from "./matrixMultiplier";

const calculateHistologyImageCoords = async (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY,
	newMriCoords
) => {
	const currentBlock = await getCurrentBlock(
		currentPlane,
		currentSlice,
		mouseX,
		mouseY,
		adjustedSlice,
		adjustedMouseX,
		adjustedMouseY
	);

	console.log("current block: " + currentBlock);

	if (currentBlock === 0) return console.log("block returned 0");

	// this shouldnt be happening, but check for this anyway to help with debugging
	if (currentBlock === undefined)
		return console.log(
			"%cError. Block returned undefined, check if the mouse coordinates were outside of the bounds of the numpy array",
			"color: red"
		);

	// TODO: I need to convert the array of strings to numbers (although it still works regardless)
	const matrix = await getCurrentMatrix(currentBlock);

	if (matrix === undefined) return;
	// console.log("matrix: " + matrix);

	const histologyImageCoords = getHistologyImageCoords(
		currentPlane,
		currentSlice,
		mouseX,
		mouseY,
		adjustedSlice,
		adjustedMouseX,
		adjustedMouseY,
		newMriCoords,
		matrix
	);

	console.log("histology image coords: ", histologyImageCoords);

	return {
		coords: histologyImageCoords,
		currentBlock: currentBlock,
		currentPlane: currentPlane,
	};
};

const getHistologyImageCoords = (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY,
	newMriCoords,
	matrix
) => {
	console.log(newMriCoords);

	// TODO: I need to find out what order to enter the paramaters for the matrix multiplications
	// TODO: I also need to find out what order to read the coords when loading in histology images
	let coords;
	let histologyImageCoords;
	if (currentPlane === "sagittal") {
		coords = matrixMultiplier(matrix, [
			newMriCoords.sagittal.slice,
			newMriCoords.coronal.slice,
			newMriCoords.axial.slice,
			1,
		]);

		const { resultX, resultY, resultZ, resultW } = coords;

		histologyImageCoords = {
			slice: resultZ.toFixed(0),
			mouseX: resultY,
			mouseY: resultX,
		};
	} else if (currentPlane === "coronal") {
		coords = matrixMultiplier(matrix, [
			newMriCoords.sagittal.slice,
			newMriCoords.coronal.slice,
			newMriCoords.axial.slice,
			1,
		]);

		const { resultX, resultY, resultZ, resultW } = coords;

		histologyImageCoords = {
			slice: resultZ.toFixed(0),
			mouseX: resultY,
			mouseY: resultX,
		};
	} else if (currentPlane === "axial") {
		coords = matrixMultiplier(matrix, [
			newMriCoords.sagittal.slice,
			newMriCoords.coronal.slice,
			newMriCoords.axial.slice,
			1,
		]);

		const { resultX, resultY, resultZ, resultW } = coords;

		histologyImageCoords = {
			slice: resultZ.toFixed(0),
			mouseX: resultY,
			mouseY: resultX,
		};
	}

	console.log("matrix calculation result: ", coords);

	return histologyImageCoords;
};

const getCurrentMatrix = async (currentBlock) => {
	let readTxt = new txtToArray();

	const paddedBlock = currentBlock.toString().padStart(2, 0);
	//console.log(paddedBlock);

	const txtFile =
		await require(`../../assets/P57-16/mri/matrices/block_${paddedBlock}.txt`)
			.default;

	const matrix = await readTxt.load(txtFile);

	return matrix;
};

const getCurrentBlock = async (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY
) => {
	let currentBlock;
	let n = new npyjs();

	const paddedSlice = currentSlice.toFixed(0).toString().padStart(3, 0);

	// need to wrap this in a try catch block
	let npyFile =
		await require(`../../assets/P57-16/mri_rotated/indices_${currentPlane}/slice_${paddedSlice}.npy`)
			.default;

	const npyArray = await n.load(npyFile);

	let ndArray = ndarray(npyArray.data, npyArray.shape);

	// the numpy arrays in the data are the opposite of the image dimensions, so a transposition is needed
	// you can alternatively take the dimensions from rotateCoords() below and get the numpy block from xRotated and yRotated
	ndArray = ndArray.transpose(1, 0);

	console.log("npy shape (after transpose): " + ndArray.shape);

	const { xRotated, yRotated } = rotateCoords(
		ndArray,
		mouseX,
		mouseY,
		currentPlane,
		adjustedSlice,
		adjustedMouseX,
		adjustedMouseY
	);

	if (currentPlane === "sagittal") {
		// sagittal has an additional horizontal flip, so we need to account for that here
		// since its been flipped, we dont need to take the adjustedMouseX... we just take the normal mouseX
		currentBlock = ndArray.get(mouseX, ndArray.shape[1] - adjustedMouseY);
	}

	if (currentPlane === "coronal" || currentPlane === "axial") {
		currentBlock = ndArray.get(mouseX, mouseY);
	}

	return currentBlock;
};

const rotateCoords = (
	ndArray,
	mouseX,
	mouseY,
	currentPlane,
	adjustedSlice,
	adjustedMouseX,
	adjustedMouseY
) => {
	const ndArray0Modified = (ndArray.shape[0] - 1) / 2;
	const ndArray1Modified = (ndArray.shape[1] - 1) / 2;
	// console.log(ndArray0Modified, ndArray1Modified);

	// the x and y have been swapped here compared to Peters python file
	const xRotated = -adjustedMouseX + 2 * ndArray1Modified;
	const yRotated = 2 * ndArray0Modified - adjustedMouseY;

	console.log("rotated mouse x: " + xRotated);
	console.log("rotated mouse y: " + yRotated);

	return { xRotated, yRotated };
};

export default calculateHistologyImageCoords;
