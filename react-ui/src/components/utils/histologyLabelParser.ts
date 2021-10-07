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
	patientId: string,
	baseAssetsUrl: string
) => {
	const currentLabelNumber = await getCurrentLabelNumber(
		mouseX,
		mouseY,
		histologyImageCoords,
		type,
		patientId,
		baseAssetsUrl
	);

	const labelsFile = await require(`../../assets/WholeHemisphereFS.json`);

	const currentLabel = labelsFile[currentLabelNumber];

	return currentLabel;
};

const getCurrentLabelNumber = async (
	mouseX: number,
	mouseY: number,
	histologyImageCoords: HistologyCoords,
	type: string,
	patientId: string,
	baseAssetsUrl: string
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

	const npzFile = `${baseAssetsUrl}${patientId}/${histologyFolder}/${paddedBlock}/slices_labels_npz/slice_${paddedSlice}.npz`;

	console.log(npzFile);

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

	// need to check if this is the right thing to do!!!
	ndArray = await ndArray.transpose(1, 0);

	const currentLabelNumber = ndArray.get(mouseX.toFixed(0), mouseY.toFixed(0));

	return currentLabelNumber;
};

export default histologyLabelParser;
