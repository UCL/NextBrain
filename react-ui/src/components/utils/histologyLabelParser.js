import npyjs from "npyjs";
import ndarray from "ndarray";

import txtLabelsToArray from "./txtLabelsToArray";
import getMouseCoords from "./getmouseCoords";

const histologyLabelParser = async (
	mouseX,
	mouseY,
	histologyImageCoords,
	type
) => {
	const currentLabelNumber = await getCurrentLabelNumber(
		mouseX,
		mouseY,
		histologyImageCoords,
		type
	);

	const parsedLabel = await parseLabel(currentLabelNumber, type);

	return parsedLabel;
};

const getCurrentLabelNumber = async (
	mouseX,
	mouseY,
	histologyImageCoords,
	type
) => {
	// label numbers are extracted from multi dimensional numpy arrays
	// the numpy array takes in x and y mouse coordinates to point to an index
	// the index returns the label number

	let n = new npyjs();

	const paddedBlock = histologyImageCoords.currentBlock
		.toString()
		.padStart(2, 0);

	const paddedSlice = histologyImageCoords.coords.slice
		.toString()
		.padStart(2, 0);

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

	const ndArray = ndarray(npyArray.data, npyArray.shape);

	const currentLabelNumber = ndArray.get(mouseX, mouseY);

	return currentLabelNumber;
};

const parseLabel = async (currentLabelNumber, type) => {
	// we extract the current label, given the current label number
	// the labels are contained in txt files so need to be parsed
	// for each label we extract: [labelNumber, labelName, r, g, b, a]

	let readTxt = new txtLabelsToArray();

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

	const parsedLabels = await readTxt.load(labelsFile);

	const currentLabel = parsedLabels[currentLabelNumber];

	return currentLabel;
};

export default histologyLabelParser;
