import npyjs from "npyjs";
import ndarray from "ndarray";

import getMatrix from "./getMatrix";
import matrixMultiplier from "./matrixMultiplier";

import { MriCoords } from "../../models/mriCoords.model";

const calculateHistologyImageCoords = async (
	currentPlane: string,
	currentSlice: number,
	mouseX: number,
	mouseY: number,
	adjustedSlice: number,
	adjustedMouseX: number,
	adjustedMouseY: number,
	newMriCoords: MriCoords,
	patientId: string
) => {
	const currentBlock = await getCurrentBlock(
		currentPlane,
		currentSlice,
		mouseX,
		mouseY,
		adjustedSlice,
		adjustedMouseX,
		adjustedMouseY,
		patientId
	);

	console.log("current block: " + currentBlock);

	if (currentBlock === 0 || currentBlock === undefined) return "no block found";

	const matrix = await getMatrix(currentBlock, "mri", patientId);

	if (matrix === undefined) return "no matrix found";

	const histologyImageCoords = getHistologyImageCoords(newMriCoords, matrix);

	return {
		coords: histologyImageCoords,
		currentBlock: currentBlock,
		currentPlane: currentPlane,
	};
};

const getHistologyImageCoords = (newMriCoords: MriCoords, matrix: number[]) => {
	const coords = matrixMultiplier(matrix, [
		newMriCoords.sagittal.slice,
		newMriCoords.coronal.slice,
		newMriCoords.axial.slice,
		1,
	]);

	let { resultX, resultY, resultZ } = coords;

	// we need to convert negative numbers to zero to avoid errors
	resultX = resultX < 0 ? 0 : resultX;
	resultY = resultY < 0 ? 0 : resultY;
	resultZ = resultZ < 0 ? 0 : resultZ;

	const histologyImageCoords = {
		slice: +resultZ.toFixed(0),
		mouseX: +resultY.toFixed(0),
		mouseY: +resultX.toFixed(0),
	};

	console.log("matrix calculation result: ", coords);

	return histologyImageCoords;
};

const getCurrentBlock = async (
	currentPlane: string,
	currentSlice: number,
	mouseX: number,
	mouseY: number,
	adjustedSlice: number,
	adjustedMouseX: number,
	adjustedMouseY: number,
	patientId: string
) => {
	let currentBlock;
	let n = new npyjs();

	console.log("current slice: " + currentSlice);

	const paddedSlice = currentSlice.toFixed(0).toString().padStart(3, "0");

	// need to wrap this in a try catch block
	let npyFile =
		await require(`../../assets/${patientId}/mri_rotated/indices_${currentPlane}/slice_${paddedSlice}.npy`)
			.default;

	const npyArray = await n.load(npyFile);

	let ndArray = ndarray(npyArray.data, npyArray.shape);

	// the numpy arrays in the data are the opposite of the image dimensions, so a transposition is needed
	// you can alternatively take the dimensions from rotateCoords() below and get the numpy block from xRotated and yRotated
	ndArray = ndArray.transpose(1, 0);

	console.log("npy shape (after transpose): " + ndArray.shape);

	// const { xRotated, yRotated } = rotateCoords(
	// 	ndArray,
	// 	mouseX,
	// 	mouseY,
	// 	currentPlane,
	// 	adjustedSlice,
	// 	adjustedMouseX,
	// 	adjustedMouseY
	// );

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

// const rotateCoords = (
// 	ndArray,
// 	mouseX,
// 	mouseY,
// 	currentPlane,
// 	adjustedSlice,
// 	adjustedMouseX,
// 	adjustedMouseY
// ) => {
// 	const ndArray0Modified = (ndArray.shape[0] - 1) / 2;
// 	const ndArray1Modified = (ndArray.shape[1] - 1) / 2;
// 	// console.log(ndArray0Modified, ndArray1Modified);

// 	// the x and y have been swapped here compared to Peters python file
// 	const xRotated = -adjustedMouseX + 2 * ndArray1Modified;
// 	const yRotated = 2 * ndArray0Modified - adjustedMouseY;

// 	console.log("rotated mouse x: " + xRotated);
// 	console.log("rotated mouse y: " + yRotated);

// 	return { xRotated, yRotated };
// };

export default calculateHistologyImageCoords;
