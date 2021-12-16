import npyjs from "npyjs";
import ndarray from "ndarray";

import getMatrix from "./getMatrix";
import matrixMultiplier from "./matrixMultiplier";
import { ASSETS_URL } from "./ASSETS_URL";

import { MriCoords } from "../../models/mriCoords.model";
import { AtlasImagesDimensionsKey } from "../../models/atlasImagesDimensionsKey.model";

const calculateHistologyImageCoords = async (
	currentMriPlane: string,
	currentMriCoords: MriCoords,
	patientId: string,
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null
) => {
	const currentMriMouseX = currentMriCoords[currentMriPlane]["mouseX"];
	const currentMriMouseY = currentMriCoords[currentMriPlane]["mouseY"];
	const currentMriSlice = currentMriCoords[currentMriPlane]["slice"];

	const currentBlock = await getCurrentBlock(
		currentMriPlane,
		currentMriMouseX,
		currentMriMouseY,
		currentMriSlice,
		patientId,
		atlasImagesDimensionsKey
	);

	process.env.NODE_ENV === "development" &&
		console.log("current block: " + currentBlock);

	if (currentBlock === 0 || currentBlock === undefined) return "no block found";

	const matrixLowRes = await getMatrix(currentBlock, "mri", patientId);
	const matrixHiRes = await getMatrix(currentBlock, "mri_hr", patientId);

	if (matrixLowRes === undefined || matrixHiRes === undefined)
		return "no matrix found";

	const histologyImageCoordsLowRes = getHistologyImageCoords(
		currentMriCoords,
		matrixLowRes,
		currentBlock,
		atlasImagesDimensionsKey
	);

	const histologyImageCoordsHiRes = getHistologyImageCoords(
		currentMriCoords,
		matrixHiRes,
		currentBlock,
		atlasImagesDimensionsKey
	);

	return {
		coordsLowRes: histologyImageCoordsLowRes.coords,
		coordsHiRes: histologyImageCoordsHiRes.coords,
		currentHistologySlice: histologyImageCoordsLowRes.slice, // slice is the same for both hi and low res
		currentHistologyBlock: currentBlock, // block is the same for both hi and low res
	};
};

const getHistologyImageCoords = (
	currentMriCoords: MriCoords,
	matrix: number[],
	currentBlock: number,
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null
) => {
	const coords = matrixMultiplier(matrix, [
		currentMriCoords.sagittal.slice,
		currentMriCoords.coronal.slice,
		currentMriCoords.axial.slice,
		1,
	]);

	let { resultX, resultY, resultZ } = validateCoords(
		coords,
		currentBlock,
		atlasImagesDimensionsKey
	);

	const histologyImageCoords = {
		mouseX: +resultY.toFixed(0),
		mouseY: +resultX.toFixed(0),
	};

	const histologySlice = +resultZ.toFixed(0);

	return { coords: histologyImageCoords, slice: histologySlice };
};

const getCurrentBlock = async (
	currentMriPlane: string,
	currentMriMouseX: number,
	currentMriMouseY: number,
	currentMriSlice: number,
	patientId: string,
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null
) => {
	let currentBlock;
	let n = new npyjs();

	process.env.NODE_ENV === "development" &&
		console.log("current slice: " + currentMriSlice);

	const paddedSlice = currentMriSlice.toFixed(0).padStart(3, "0");

	let npyFile;
	try {
		npyFile = `${ASSETS_URL}${patientId}/mri_rotated/indices_${currentMriPlane}/slice_${paddedSlice}.npy`;
	} catch (e) {
		console.log(e);
	}

	// parse the raw npy file as a readable npy array
	const npyArray = await n.load(npyFile);

	let ndArray = ndarray(npyArray.data, npyArray.shape);

	// the numpy arrays in the data are the opposite of the image dimensions, so a transposition is needed
	ndArray = await ndArray.transpose(1, 0);

	if (currentMriPlane === "sagittal") {
		// sagittal has an additional horizontal flip, so we need to account for that here
		// since its been flipped, we dont need to take the adjustedMriMouseX... we just take the normal currentMriMouseX
		currentBlock = ndArray.get(
			currentMriMouseX,
			ndArray.shape[1] -
				(+atlasImagesDimensionsKey!.mriDimensions.sagittal.height -
					currentMriMouseY)
		);
	}

	if (currentMriPlane === "coronal" || currentMriPlane === "axial") {
		currentBlock = ndArray.get(currentMriMouseX, currentMriMouseY);
	}

	return currentBlock;
};

const validateCoords = (
	coords: { resultX: number; resultY: number; resultZ: number },
	currentBlock: number,
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null
) => {
	// we need to convert negative numbers to zero to avoid errors and load the right slice
	let resultX = coords.resultX < 0 ? 0 : coords.resultX;
	let resultY = coords.resultY < 0 ? 0 : coords.resultY;
	let resultZ = coords.resultZ < 0 ? 0 : coords.resultZ;

	// if returned slice exceeds the number of slices in the block (within +2 slices) then return the maximum slice number
	// we make an adjustment to account for the fact that slices start at 0 within a block
	// if returned slice exceeds maximum number of slices +2 then its a calcultion bug
	if (
		resultZ >
			+atlasImagesDimensionsKey!.histologyLowResDimensions[currentBlock]
				.slices -
				1 &&
		resultZ <
			+atlasImagesDimensionsKey!.histologyLowResDimensions[currentBlock]
				.slices +
				1
	) {
		resultZ =
			+atlasImagesDimensionsKey!.histologyLowResDimensions[currentBlock]
				.slices - 1;
	}

	return { resultX, resultY, resultZ };
};

export default calculateHistologyImageCoords;
