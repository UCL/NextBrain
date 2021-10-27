import ndarray from "ndarray";

import npzParser from "./npzParser";
import { ASSETS_URL } from "./ASSETS_URL";

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

	const labelsFile = await require(`../../assets/WholeHemisphereFS.json`);

	const currentLabel = labelsFile[currentLabelNumber];

	return currentLabel;
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

	const n = new npzParser(); // uncompresses and parses an npz file

	const paddedBlock = histologyImageCoords.currentHistologyBlock
		.toString()
		.padStart(2, "0");

	const paddedSlice = histologyImageCoords.currentHistologySlice
		.toString()
		.padStart(2, "0");

	const histologyFolder = type === "lowRes" ? "histology" : "histology_hr";

	const npzFile = `${ASSETS_URL}${patientId}/${histologyFolder}/${paddedBlock}/slices_labels_npz/slice_${paddedSlice}.npz`;

	const npyData = await n.load(npzFile); // returns uncompressed raw contents of an npz file

	console.log(npyData);

	let ndArray = ndarray(npyData!.data, npyData!.header.shape);

	ndArray = await ndArray.transpose(1, 0);

	const currentLabelNumber = ndArray.get(mouseX.toFixed(0), mouseY.toFixed(0));

	return currentLabelNumber;
};

export default histologyLabelParser;
