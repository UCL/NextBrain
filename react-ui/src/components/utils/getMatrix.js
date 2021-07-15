import txtToArray from "./txtToArray";

const getCurrentMatrix = async (currentBlock, type) => {
	let readTxt = new txtToArray();

	const paddedBlock = currentBlock.toString().padStart(2, 0);

	let txtFile;
	if (type === "mri") {
		txtFile =
			await require(`../../assets/P57-16/mri/matrices/block_${paddedBlock}.txt`)
				.default;
	}

	if (type === "histology") {
		txtFile =
			await require(`../../assets/P57-16/histology/${paddedBlock}/matrix.txt`)
				.default;
	}

	if (type === "histology_hr") {
		txtFile =
			await require(`../../assets/P57-16/histology_hr/${paddedBlock}/matrix.txt`)
				.default;
	}

	const matrix = await readTxt.load(txtFile);

	return matrix;
};

export default getCurrentMatrix;
