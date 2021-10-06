import npyjs from "npyjs";
import ndarray from "ndarray";

import getMatrix from "./getMatrix";
import matrixMultiplier from "./matrixMultiplier";
import histologyCoordinatesKey from "./histologyCoordinatesKey";

import { MriCoords } from "../../models/mriCoords.model";

const calculateHistologyImageCoords = async (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number,
	adjustedMriSlice: number,
	adjustedMriMouseX: number,
	adjustedMriMouseY: number,
	newMriCoords: MriCoords,
	patientId: string,
	baseAssetsUrl: string
) => {
	const currentBlock = await getCurrentBlock(
		currentMriPlane,
		currentMriSlice,
		currentMriMouseX,
		currentMriMouseY,
		adjustedMriSlice,
		adjustedMriMouseX,
		adjustedMriMouseY,
		patientId
	);

	console.log("current block: " + currentBlock);

	if (currentBlock === 0 || currentBlock === undefined) return "no block found";

	const matrixLowRes = await getMatrix(
		currentBlock,
		"mri",
		patientId,
		baseAssetsUrl
	);
	const matrixHiRes = await getMatrix(
		currentBlock,
		"mri_hr",
		patientId,
		baseAssetsUrl
	);

	if (matrixLowRes === undefined || matrixHiRes === undefined)
		return "no matrix found";

	const histologyImageCoordsLowRes = getHistologyImageCoords(
		newMriCoords,
		matrixLowRes,
		currentBlock
	);

	const histologyImageCoordsHiRes = getHistologyImageCoords(
		newMriCoords,
		matrixHiRes,
		currentBlock
	);

	return {
		coordsLowRes: histologyImageCoordsLowRes.coords,
		coordsHiRes: histologyImageCoordsHiRes.coords,
		currentHistologySlice: histologyImageCoordsLowRes.slice, // slice is the same for both hi and low res
		currentHistologyBlock: currentBlock,
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
		mouseX: +resultY.toFixed(0),
		mouseY: +resultX.toFixed(0),
	};

	const histologySlice = +resultZ.toFixed(0);

	return { coords: histologyImageCoords, slice: histologySlice };
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
		resultZ > histologyCoordinatesKey[currentBlock].slices - 1 &&
		resultZ < histologyCoordinatesKey[currentBlock].slices + 1
	) {
		resultZ = histologyCoordinatesKey[currentBlock].slices - 1;
	}

	return { resultX, resultY, resultZ };
};

const getCurrentBlock = async (
	currentMriPlane: string,
	currentMriSlice: number,
	currentMriMouseX: number,
	currentMriMouseY: number,
	adjustedMriSlice: number,
	adjustedMriMouseX: number,
	adjustedMriMouseY: number,
	patientId: string
) => {
	let currentBlock;
	let n = new npyjs();

	console.log("current slice: " + currentMriSlice);

	const paddedSlice = currentMriSlice.toFixed(0).toString().padStart(3, "0");

	// need to wrap this in a try catch block
	let npyFile;
	try {
		npyFile =
			await require(`../../assets/${patientId}/mri_rotated/indices_${currentMriPlane}/slice_${paddedSlice}.npy`)
				.default;
	} catch (e: any) {
		throw new Error(e);
	}

	const npyArray = await n.load(npyFile);

	console.log(npyArray);

	let ndArray = ndarray(npyArray.data, npyArray.shape);

	// the numpy arrays in the data are the opposite of the image dimensions, so a transposition is needed
	// you can alternatively take the dimensions from rotateCoords() below and get the numpy block from xRotated and yRotated
	ndArray = ndArray.transpose(1, 0);

	console.log("npy shape (after transpose): " + ndArray.shape);

	// const { xRotated, yRotated } = rotateCoords(
	// 	ndArray,
	// 	currentMriMouseX,
	// 	currentMriMouseY,
	// 	currentMriPlane,
	// 	adjustedMriSlice,
	// 	adjustedMriMouseX,
	// 	adjustedMriMouseY
	// );

	if (currentMriPlane === "sagittal") {
		// sagittal has an additional horizontal flip, so we need to account for that here
		// since its been flipped, we dont need to take the adjustedMriMouseX... we just take the normal currentMriMouseX
		currentBlock = ndArray.get(
			currentMriMouseX,
			ndArray.shape[1] - adjustedMriMouseY
		);
	}

	if (currentMriPlane === "coronal" || currentMriPlane === "axial") {
		currentBlock = ndArray.get(currentMriMouseX, currentMriMouseY);
	}

	return currentBlock;
};

// const rotateCoords = (
// 	ndArray,
// 	currentMriMouseX,
// 	currentMriMouseY,
// 	currentMriPlane,
// 	adjustedMriSlice,
// 	adjustedMriMouseX,
// 	adjustedMriMouseY
// ) => {
// 	const ndArray0Modified = (ndArray.shape[0] - 1) / 2;
// 	const ndArray1Modified = (ndArray.shape[1] - 1) / 2;
// 	// console.log(ndArray0Modified, ndArray1Modified);

// 	// the x and y have been swapped here compared to Peters python file
// 	const xRotated = -adjustedMriMouseX + 2 * ndArray1Modified;
// 	const yRotated = 2 * ndArray0Modified - adjustedMriMouseY;

// 	console.log("rotated mouse x: " + xRotated);
// 	console.log("rotated mouse y: " + yRotated);

// 	return { xRotated, yRotated };
// };

export default calculateHistologyImageCoords;
