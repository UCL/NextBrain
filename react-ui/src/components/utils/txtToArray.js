class txtToArray {
	async parse(file) {
		let removedLineBreaks = file.replace(/\n/g, " ");

		var txtToArray = removedLineBreaks.split(" ");
		txtToArray.pop();

		// convert the array of strings to numbers
		const arrayAsNumbers = txtToArray.map((element) => {
			return Number(element);
		});

		return arrayAsNumbers;
	}

	async load(filename) {
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

export default txtToArray;
