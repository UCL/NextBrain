import npyjs from "npyjs";
import ndarray from "ndarray";

import mriCoordinatesKey from "./mriCoordinatesKey";
import txtToArray from "./txtToArray";
import matrixMultiplier from "./matrixMultiplier";

const calculateHistologyImageCoords = async (
	currentPlane,
	currentSlice,
	mouseX,
	mouseY
) => {
	console.log("--------");
	console.log("current plane: " + currentPlane);
	console.log("current slice: " + currentSlice);
	console.log("mouseX: " + mouseX, "mouseY: " + mouseY);

	const currentBlock = await getCurrentBlock(
		currentPlane,
		currentSlice,
		mouseX,
		mouseY
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
	if (matrix === undefined) {
		return;
	}
	// console.log("matrix: " + matrix);

	const histologyImageCoords = getHistologyImageCoords(
		currentPlane,
		currentSlice,
		mouseX,
		mouseY,
		matrix
	);

	console.log(histologyImageCoords, currentBlock);
	console.log("--------");

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
	matrix
) => {
	// TODO: I need to find out what order to enter the paramaters for the matrix multiplications
	// TODO: I also need to find out what order to read the coords when loading in histology images
	let coords;
	let histologyImageCoords;
	if (currentPlane === "sagittal") {
		coords = matrixMultiplier(matrix, [mouseY, currentSlice, mouseX, 1]);
		console.log(coords);
		histologyImageCoords = {
			slice: coords[1].toFixed(0),
			mouseX: coords[2],
			mouseY: coords[0],
		};
	} else if (currentPlane === "coronal") {
		coords = matrixMultiplier(matrix, [currentSlice, mouseY, mouseX, 1]);
		console.log(coords);
		histologyImageCoords = {
			slice: coords[0].toFixed(0),
			mouseX: coords[2],
			mouseY: coords[1],
		};
	} else if (currentPlane === "axial") {
		coords = matrixMultiplier(matrix, [
			mriCoordinatesKey.axial.width - mouseX,
			mriCoordinatesKey.axial.height - mouseY,
			currentSlice,
			1,
		]);
		console.log(coords);
		histologyImageCoords = {
			slice: coords[2].toFixed(0),
			mouseX: coords[1],
			mouseY: coords[0],
		};
	}

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

const getCurrentBlock = async (currentPlane, currentSlice, mouseX, mouseY) => {
	let n = new npyjs();

	const paddedSlice = currentSlice.toFixed(0).toString().padStart(3, 0);

	let npyFile;

	// need to wrap this in a try catch block
	npyFile =
		await require(`../../assets/P57-16/mri_rotated/indices_${currentPlane}/slice_${paddedSlice}.npy`)
			.default;

	const npyArray = await n.load(npyFile);

	const ndArray = ndarray(npyArray.data, npyArray.shape);
	//ndArray = ndArray.transpose(1, 0); // temporarily tanspose for debugging

	console.log("npy shape: " + ndArray.shape);

	const { xRot, yRot } = rotateNumpy(ndArray, mouseX, mouseY);

	const currentBlock = ndArray.get(yRot, xRot);

	return currentBlock;
};

const rotateNumpy = (ndArray, mouseX, mouseY) => {
	const ndArray0Modified = (ndArray.shape[0] - 1) / 2;
	const ndArray1Modified = (ndArray.shape[1] - 1) / 2;
	console.log(ndArray0Modified, ndArray1Modified);

	let adjustedMouseX = mriCoordinatesKey.axial.width - mouseX;
	let adjustedMouseY = mriCoordinatesKey.axial.height - mouseY;

	console.log("adjusted axial x: " + adjustedMouseX);
	console.log("adjusted axial y: " + adjustedMouseY);

	// the x and y have been swapped here compared to Peters python file
	const xRot = -adjustedMouseX + 2 * ndArray1Modified;
	const yRot = 2 * ndArray0Modified - adjustedMouseY;

	console.log(xRot, yRot);

	return { xRot, yRot };
};

export default calculateHistologyImageCoords;
