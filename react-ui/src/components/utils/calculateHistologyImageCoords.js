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

	// need to wrap this in a try catch block
	let npyFile =
		await require(`../../assets/P57-16/mri_rotated/indices_${currentPlane}/slice_${paddedSlice}.npy`)
			.default;

	const npyArray = await n.load(npyFile);
	console.log(npyArray);

	let ndArray = ndarray(npyArray.data, npyArray.shape);
	//ndArray = ndArray.transpose(1, 0); // temporarily tanspose for debugging
	console.log(ndArray);

	console.log("npy shape: " + ndArray.shape);

	const { xRotated, yRotated } = rotateCoords(
		ndArray,
		mouseX,
		mouseY,
		currentPlane
	);

	let currentBlock;

	if (currentPlane === "sagittal") {
		currentBlock = ndArray.get(xRotated, yRotated);
	}

	if (currentPlane === "coronal" || currentPlane === "axial") {
		currentBlock = ndArray.get(mouseX, mouseY);
	}

	return currentBlock;
};

const rotateCoords = (ndArray, mouseX, mouseY, currentPlane) => {
	const ndArray0Modified = (ndArray.shape[0] - 1) / 2;
	const ndArray1Modified = (ndArray.shape[1] - 1) / 2;
	console.log(ndArray0Modified, ndArray1Modified);

	// just doing this for axial right now to get at least one plane working

	let rotatedMouseX;
	let rotatedMouseY;

	if (currentPlane === "sagittal") {
		rotatedMouseX = mriCoordinatesKey.sagittal.width - mouseX;
		rotatedMouseY = mriCoordinatesKey.sagittal.height - mouseY;
	}

	if (currentPlane === "coronal") {
		rotatedMouseX = mriCoordinatesKey.coronal.width - mouseX;
		rotatedMouseY = mriCoordinatesKey.coronal.height - mouseY;
	}

	if (currentPlane === "axial") {
		rotatedMouseX = mriCoordinatesKey.axial.width - mouseX;
		rotatedMouseY = mriCoordinatesKey.axial.height - mouseY;
	}

	console.log("rotated mouse x: " + rotatedMouseX);
	console.log("rotatedmouse y: " + rotatedMouseY);

	// the x and y have been swapped here compared to Peters python file
	const xRotated = -rotatedMouseX + 2 * ndArray1Modified;
	const yRotated = 2 * ndArray0Modified - rotatedMouseY;

	console.log(xRotated, yRotated);

	return { xRotated, yRotated };
};

export default calculateHistologyImageCoords;
