// loads in the histology txt labels and parses them for use in the application

import npyjs from "npyjs";
import ndarray from "ndarray";

import { HistologyCoords } from "../../models/histologyCoords.model";

const histologyLabelParser = async (
	mouseX: number,
	mouseY: number,
	histologyImageCoords: HistologyCoords,
	type: string,
	patientId: string
) => {
	const currentLabelNumber = await getCurrentLabelNumber(
		mouseX,
		mouseY,
		histologyImageCoords,
		type,
		patientId
	);

	console.log(mouseX, mouseY, histologyImageCoords, type);

	const parsedLabel = await parseLabel(currentLabelNumber, type);

	return parsedLabel;
};

const getCurrentLabelNumber = async (
	mouseX: number,
	mouseY: number,
	histologyImageCoords: HistologyCoords,
	type: string,
	patientId: string
) => {
	// label numbers are extracted from multi dimensional numpy arrays
	// the numpy array takes in x and y mouse coordinates to point to an index
	// the index returns the label number

	let n = new npyjs();

	const paddedBlock = histologyImageCoords.currentBlock
		.toString()
		.padStart(2, "0");

	const paddedSlice = histologyImageCoords.coords.slice
		.toString()
		.padStart(2, "0");

	let npyFile;

	// the npy files are missing from the updated folder for the labels
	// I need the npy files to parse the label (I think)
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

	console.log(ndArray);

	const currentLabelNumber = ndArray.get(mouseX.toFixed(0), mouseY.toFixed(0));

	console.log(currentLabelNumber);

	return currentLabelNumber;
};

const parseLabel = async (currentLabelNumber: number, type: string) => {
	// we extract the current label, given the current label number
	// the labels are contained in txt files so need to be parsed
	// for each label we extract: [labelNumber, labelName, r, g, b, a]

	let readTxt = new txtLabelsToArray();

	let labelsFile;

	if (type === "lowRes") {
		labelsFile = await require(`../../assets/lookup_table.txt`).default;
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

// custom parser to extract labels txt data into an array
class txtLabelsToArray {
	async parse(file: string) {
		var txtToArray = file.split("\n");
		txtToArray.pop();

		// split each label item into its own array element
		const labelsArray = txtToArray.map((element) => {
			return element.split(/\s/g);
		});

		// remove empty strings in each label array
		const parsedLabelsArray = labelsArray.map((element) => {
			return element.filter((innerElement) => {
				if (innerElement === "") return false; // skip
				return true;
			});
		});

		return parsedLabelsArray;
	}

	async load(filename: RequestInfo) {
		return fetch(filename)
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				const parsedTxt = this.parse(text);
				return parsedTxt;
			});
	}
}

export default histologyLabelParser;
