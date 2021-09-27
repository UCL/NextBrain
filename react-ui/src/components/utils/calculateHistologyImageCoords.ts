import npyjs from "npyjs";
import ndarray from "ndarray";

import getMatrix from "./getMatrix";
import matrixMultiplier from "./matrixMultiplier";
import histologySliceMap from "./histologySliceMap";

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

	const histologyImageCoords = getHistologyImageCoords(
		newMriCoords,
		matrix,
		currentBlock
	);

	return {
		coords: histologyImageCoords,
		currentBlock: currentBlock,
		currentPlane: currentPlane,
	};
};

const getHistologyImageCoords = (
	newMriCoords: MriCoords,
	matrix: number[],
	currentBlock: number
) => {
	const coords = matrixMultiplier(matrix, [
		newMriCoords.sagittal.slice,
		newMriCoords.coronal.slice,
		newMriCoords.axial.slice,
		1,
	]);

	let { resultX, resultY, resultZ } = validateCoords(coords, currentBlock);

	const histologyImageCoords = {
		slice: +resultZ.toFixed(0),
		mouseX: +resultY.toFixed(0),
		mouseY: +resultX.toFixed(0),
	};

	console.log("matrix calculation result: ", coords);

	return histologyImageCoords;
};

const validateCoords = (
	coords: { resultX: number; resultY: number; resultZ: number },
	currentBlock: number
) => {
	// we need to convert negative numbers to zero to avoid errors and load the right slice
	let resultX = coords.resultX < 0 ? 0 : coords.resultX;
	let resultY = coords.resultY < 0 ? 0 : coords.resultY;
	let resultZ = coords.resultZ < 0 ? 0 : coords.resultZ;

	// if returned slice exceeds the number of slices in the block (within +2 slices) then return the maximum slice number
	// we make an adjustment to account for the fact that slices start at 0 within a block
	// if returned slice exceeds maximum number of slices +2 then its a calcultion bug
	if (
		resultZ > histologySliceMap[currentBlock].slices - 1 &&
		resultZ < histologySliceMap[currentBlock].slices + 1
	) {
		resultZ = histologySliceMap[currentBlock].slices - 1;
	}

	return { resultX, resultY, resultZ };
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

	console.log(ndArray);

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
