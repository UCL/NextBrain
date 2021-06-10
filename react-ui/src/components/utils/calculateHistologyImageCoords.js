import ndarray from "ndarray";

import npyjs from "./npy";
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

	// TODO: I need to convert the array of strings to numbers (although it still works regardless)
	const matrix = await getCurrentMatrix(currentBlock);
	if (matrix === undefined) {
		return;
	}
	// console.log("matrix: " + matrix);

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
		coords = matrixMultiplier(matrix, [mouseX, mouseY, currentSlice, 1]);
		console.log(coords);
		histologyImageCoords = {
			slice: coords[2].toFixed(0),
			mouseX: coords[0],
			mouseY: coords[1],
		};
	}

	console.log(histologyImageCoords, currentBlock);
	console.log("--------");

	return {
		coords: histologyImageCoords,
		currentBlock: currentBlock,
		currentPlane: currentPlane,
	};
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
	//console.log(n);

	const paddedSlice = currentSlice.toString().padStart(3, 0);

	let npyFile;

	if (currentPlane === "axial") {
		npyFile =
			await require(`../../assets/P57-16/mri/indices_${currentPlane}_C_order/slice_${paddedSlice}.npy`)
				.default;
	} else {
		npyFile =
			await require(`../../assets/P57-16/mri/indices_${currentPlane}/slice_${paddedSlice}.npy`)
				.default;
	}

	const npyArray = await n.load(npyFile);

	// axial seems to be in fortran order while the other two are in C order
	let ndArray;
	// if (currentPlane === "axial") {
	// 	// initialise the ndarray with a stride that conforms to C contiguity
	// 	// this is done by editing the stride
	// 	// original Fortran contiguity stride = [448, 1] (which is the same as stride = [data.shape[1], 1])
	// 	// transforming this stride to C contiguous = [1, 224] (which is the same as stride = [1, data.shape[0]])
	// 	// this allows us to access array indexes correctly
	// 	// for more info see https://ajcr.net/stride-guide-part-2/
	// 	ndArray = ndarray(
	// 		npyArray.data,
	// 		npyArray.shape,
	// 		[1, npyArray.shape[0]],
	// 		npyArray.offset
	// 	);
	// 	//console.log(ndArray);
	// } else {
	// 	ndArray = ndarray(npyArray.data, npyArray.shape);
	// }
	ndArray = ndarray(npyArray.data, npyArray.shape);
	//ndArray = ndArray.transpose(1, 0);

	console.log("npy shape: " + ndArray.shape);

	const currentBlock = ndArray.get(mouseX, mouseY);

	return currentBlock;
};

export default calculateHistologyImageCoords;
