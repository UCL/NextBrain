// a helper function that loads in a matrix txt file
// we multiply the matrix by a vector point (i.e. our image coords) to get a new set of coords

import { ASSETS_URL } from "./ASSETS_URL";

const getMatrix = async (
	currentBlock: number,
	type: string,
	patientId: string
) => {
	const paddedBlock = currentBlock.toString().padStart(2, "0");

	let fileUrl = "";
	let txtFile;

	// fetch the txt file from remote server
	if (type === "mri") {
		fileUrl = `${ASSETS_URL}${patientId}/mri_rotated/matrices/block_${paddedBlock}.txt`;
	}

	if (type === "mri_hr") {
		fileUrl = `${ASSETS_URL}${patientId}/mri_rotated/matrices_hr/block_${paddedBlock}.txt`;
	}

	if (type === "histology") {
		fileUrl = `${ASSETS_URL}${patientId}/histology/${paddedBlock}/matrix.txt`;
	}

	if (type === "histology_hr") {
		fileUrl = `${ASSETS_URL}${patientId}/histology_hr/${paddedBlock}/matrix.txt`;
	}

	const file = await fetch(fileUrl);

	txtFile = await file.text();

	const matrix = await parseMatrixTxt(txtFile);

	return matrix;
};

// custom parser to transform matrix txt data into an array
const parseMatrixTxt = async (file: string) => {
	let removedLineBreaks = file.replace(/\n/g, " ");

	var txtToArray = removedLineBreaks.split(" ");
	txtToArray.pop();

	// convert the array of strings to numbers
	const arrayAsNumbers = txtToArray.map((element) => {
		return Number(element);
	});

	return arrayAsNumbers;
};

export default getMatrix;
