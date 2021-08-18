import npyjs from "npyjs";
import ndarray from "ndarray";

import txtToArray from "./txtToArray";
import getMouseCoords from "./getmouseCoords";

const histologyLabelParser = async (e, histologyImageCoords, type) => {
	const { mouseX, mouseY } = getMouseCoords(e);

	const currentLabelNumber = await getCurrentLabelNumber(
		mouseX,
		mouseY,
		histologyImageCoords,
		type
	);

	console.log(currentLabelNumber);

	const parsedLabel = await parseLabel(currentLabelNumber, type);

	return parsedLabel;
};

const getCurrentLabelNumber = async (
	mouseX,
	mouseY,
	histologyImageCoords,
	type
) => {
	let n = new npyjs();

	const paddedBlock = histologyImageCoords.currentBlock
		.toString()
		.padStart(2, 0);

	const paddedSlice = histologyImageCoords.coords.slice
		.toString()
		.padStart(2, 0);

	// console.log(paddedBlock);
	// console.log(paddedSlice);

	let npyFile;

	if (type === "lowRes") {
		npyFile =
			await require(`../../assets/P57-16/histology/${paddedBlock}/slices_labels/slice_${paddedSlice}.npy`)
				.default;
	}

	if (type === "hiRes") {
		npyFile =
			await require(`../../assets/P57-16/histology_hr/${paddedBlock}/slices_labels/slices_${paddedSlice}.npy`)
				.default;
	}

	const npyArray = await n.load(npyFile);

	let ndArray = ndarray(npyArray.data, npyArray.shape);

	console.log(ndArray);

	const currentLabel = ndArray.get(mouseX, mouseY);

	return currentLabel;
};

const parseLabel = async (currentLabelNumber, type) => {
	let readTxt = new txtToArray();

	console.log(currentLabelNumber);

	let labelsFile;

	if (type === "lowRes") {
		labelsFile = await require(`../../assets/P57-16/histology/lookup_table.txt`)
			.default;
	}

	// if (type === "hiRes") {
	// 	labelsFile =
	// 		await require("../../assets/P57-16/histology_hr/lookup_table.txt")
	// 			.default;
	// }

	const parsedLabel = await readTxt.load(labelsFile);

	console.log(parsedLabel);
};

export default histologyLabelParser;
