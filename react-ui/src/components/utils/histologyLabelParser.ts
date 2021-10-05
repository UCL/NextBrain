// loads in the histology txt labels and parses them for use in the application

// import npyjs from "npyjs";
import ndarray from "ndarray";
import JSZip from "jszip";

import npzAsArrayBuffer from "./npzAsArrayBuffer";

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

	// console.log(mouseX, mouseY, histologyImageCoords, type);

	console.log(currentLabelNumber);

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
	// label numbers are extracted from multi dimensional numpy arrays (extracted from compressed npz files)
	// the numpy array takes in x and y mouse coordinates to point to an index
	// the index returns the label number

	let n = new npzAsArrayBuffer();
	let zip = new JSZip();

	const paddedBlock = histologyImageCoords.currentHistologyBlock
		.toString()
		.padStart(2, "0");

	const paddedSlice = histologyImageCoords.currentHistologySlice
		.toString()
		.padStart(2, "0");

	const histologyFolder = type === "lowRes" ? "histology" : "histology_hr";

	const npzFile =
		await require(`../../assets/${patientId}/${histologyFolder}/${paddedBlock}/slices_labels_npz/slice_${paddedSlice}.npz`)
			.default;

	const npzArrayBuffer = await n.load(npzFile); // returns raw contents as an unparsed array buffer

	const npzUint8Array = new Uint8Array(npzArrayBuffer); // parse the arrayBuffer as a uint8Array

	const loadedZip = await zip.loadAsync(npzUint8Array!); // get all files in the zip

	const filesData = Object.entries(loadedZip.files)[0][0]; // the name of the file insise the zip file

	// parse the loaded zip as an arrayBuffer
	const unzippedArrayBuffer = await loadedZip
		.file(filesData)!
		.async("arraybuffer");

	// we need to parse both the uint8array data and the uint16 array data from the zip
	// we get the header info from the unit8 data
	// and we get the actual npy array data from the uint16 data
	// although it seems to work, this seems weird, so i'm probably just missing something

	// create the header data from the uint8Array data
	let headerData = new Uint8Array(unzippedArrayBuffer);
	let hcontents = new TextDecoder("utf-8").decode(
		new Uint8Array(headerData.slice(10, 10 + 118))
	);
	var header = JSON.parse(
		hcontents
			.toLowerCase() // True -> true
			.replace(/'/g, '"')
			.replace("(", "[")
			.replace(/,*\),*/g, "]")
	);
	console.log(header);

	// get the npy array data from the uint16array
	let npyData = new Uint16Array(unzippedArrayBuffer.slice(128));

	// process the array data accordingly
	let ndArray = ndarray(npyData, header.shape);
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

	labelsFile = await require(`../../assets/lookup_table.txt`).default;

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
