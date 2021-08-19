class txtLabelsToArray {
	async parse(file) {
		//let removedLineBreaks = file.replace(/\n/g, " ");

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

export default txtLabelsToArray;
