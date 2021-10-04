export default class npzAsArrayBuffer {
	async readFileAsync(file) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;

			reader.readAsArrayBuffer(file);
		});
	}

	async load(filename, callback) {
		/*
        Loads an array from a stream of bytes.
        */
		let self = this;
		return fetch(filename)
			.then((fh) => {
				console.log(fh);
				if (fh.ok) {
					return fh
						.blob()
						.then((i) => {
							var content = i;
							console.log(i);

							return self.readFileAsync(content).then((res) => {
								return res;
							});
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => console.error(err));
	}
}
