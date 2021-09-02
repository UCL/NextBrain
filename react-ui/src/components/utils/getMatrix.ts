// a helper function that load in a matrix txt file

const getMatrix = async (currentBlock: number, type: string) => {
	let readTxt = new txtToArray();

	const paddedBlock = currentBlock.toString().padStart(2, "0");

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

export default getMatrix;
