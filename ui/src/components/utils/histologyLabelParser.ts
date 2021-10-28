import ndarray from "ndarray";

import npzParser from "./npzParser";
import { ASSETS_URL } from "./ASSETS_URL";

import { HistologyCoords } from "../../models/histologyCoords.model";

const histologyLabelParser = async (
	histologyImageCoords: HistologyCoords,
	showHiRes: boolean,
	patientId: string
) => {
	const currentLabelNumber = await getCurrentLabelNumber(
		histologyImageCoords,
		showHiRes,
		patientId
	);

	const labelsFile = await require(`../../assets/WholeHemisphereFS.json`);

	const currentLabel = labelsFile[currentLabelNumber];

	return currentLabel;
};

const getCurrentLabelNumber = async (
	histologyImageCoords: HistologyCoords,
	showHiRes: boolean,
	patientId: string
) => {
	// label numbers are extracted from multi dimensional numpy arrays (extracted from compressed npz files)
	// the numpy array takes in x and y mouse coordinates to point to an index
	// the index returns the label number

	const n = new npzParser(); // uncompresses and parses an npz file
	const coordsProp = showHiRes ? "coordsHiRes" : "coordsLowRes";
	const histologyFolder = !showHiRes ? "histology" : "histology_hr";

	const paddedBlock = histologyImageCoords.currentHistologyBlock
		.toString()
		.padStart(2, "0");

	const paddedSlice = histologyImageCoords.currentHistologySlice
		.toString()
		.padStart(2, "0");

	const npzFile = `${ASSETS_URL}${patientId}/${histologyFolder}/${paddedBlock}/slices_labels_npz/slice_${paddedSlice}.npz`;

	const npyData = await n.load(npzFile); // returns uncompressed raw contents of an npz file

	let ndArray = ndarray(npyData!.data, npyData!.header.shape);

	ndArray = await ndArray.transpose(1, 0);

	const currentLabelNumber = ndArray.get(
		histologyImageCoords[coordsProp].mouseX.toFixed(0),
		histologyImageCoords[coordsProp].mouseY.toFixed(0)
	);

	return currentLabelNumber;
};

export default histologyLabelParser;
