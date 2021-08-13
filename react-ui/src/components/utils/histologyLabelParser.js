import txtToArray from "./txtToArray";

const histologyLabelParser = async (e, histologyImageCoords, type) => {
	let readTxt = new txtToArray();

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

	console.log(npyFile);

	//const matrix = await readTxt.load(txtFile);

	//return matrix;
};

export default histologyLabelParser;
