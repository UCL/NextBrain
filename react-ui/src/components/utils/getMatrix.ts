// a helper function that load in a matrix txt file

const getMatrix = async (
	currentBlock: number,
	type: string,
	patientId: string,
	baseAssetsUrl: string
) => {
	let readTxt = new txtToArray();

	const paddedBlock = currentBlock.toString().padStart(2, "0");

	let fileUrl = "";
	let txtFile;

	// fetch the txt file from remote server
	if (type === "mri") {
		fileUrl = `${baseAssetsUrl}/main/${patientId}/mri_rotated/matrices/block_${paddedBlock}.txt`;
	}

	if (type === "mri_hr") {
		fileUrl = `${baseAssetsUrl}/main/${patientId}/mri_rotated/matrices_hr/block_${paddedBlock}.txt`;
	}

	if (type === "histology") {
		fileUrl = `${baseAssetsUrl}/main/${patientId}/histology/${paddedBlock}/matrix.txt`;
	}

	if (type === "histology_hr") {
		fileUrl = `${baseAssetsUrl}/main/${patientId}/histology_hr/${paddedBlock}/matrix.txt`;
	}

	const file = await fetch(fileUrl);

	txtFile = await file.text();

	const matrix = await readTxt.parse(txtFile);

	return matrix;
};

// custom parser to extract matrix txt data into an array
class txtToArray {
	async parse(file: string) {
		let removedLineBreaks = file.replace(/\n/g, " ");

		var txtToArray = removedLineBreaks.split(" ");
		txtToArray.pop();

		// convert the array of strings to numbers
		const arrayAsNumbers = txtToArray.map((element) => {
			return Number(element);
		});

		return arrayAsNumbers;
	}

	// async load(filename: RequestInfo) {
	// 	return fetch(filename)
	// 		.then((response) => {
	// 			return response.text();
	// 		})
	// 		.then((text) => {
	// 			const parsedTxt = this.parse(text);
	// 			return parsedTxt;
	// 		});
	// }
}

export default getMatrix;
