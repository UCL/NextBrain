const fetch = window.fetch;

class readTxt {
	constructor(opts) {
		if (opts) {
			console.error(
				[
					"No arguments accepted to npyjs constructor.",
					"For usage, go to https://github.com/jhuapl-boss/npyjs.",
				].join(" ")
			);
		}

		this.dtypes = {
			"<u1": {
				name: "uint8",
				size: 8,
				arrayConstructor: Uint8Array,
			},
			"|u1": {
				name: "uint8",
				size: 8,
				arrayConstructor: Uint8Array,
			},
			"<u2": {
				name: "uint16",
				size: 16,
				arrayConstructor: Uint16Array,
			},
			"|i1": {
				name: "int8",
				size: 8,
				arrayConstructor: Int8Array,
			},
			"<i2": {
				name: "int16",
				size: 16,
				arrayConstructor: Int16Array,
			},
			"<u4": {
				name: "uint32",
				size: 32,
				arrayConstructor: Int32Array,
			},
			"<i4": {
				name: "int32",
				size: 32,
				arrayConstructor: Int32Array,
			},
			"<f4": {
				name: "float32",
				size: 32,
				arrayConstructor: Float32Array,
			},
			"<f8": {
				name: "float64",
				size: 64,
				arrayConstructor: Float64Array,
			},
		};
	}

	parse(arrayBufferContents) {
		// const version = arrayBufferContents.slice(6, 8); // Uint8-encoded
		const headerLength = new DataView(
			arrayBufferContents.slice(8, 10)
		).getUint8(0);
		//console.log(headerLength);
		const offsetBytes = 10 + headerLength;

		let hcontents = new TextDecoder("utf-8").decode(
			new Uint8Array(arrayBufferContents.slice(10, 10 + headerLength))
		);

		var header = JSON.parse(
			hcontents
				.replace(/'/g, '"')
				.replace("True", "true")
				.replace("False", "false")
				.replace("(", "[")
				.replace(/,*\),*/g, "]")
		);
		var shape = header.shape;

		//console.log(header);

		let dtype = this.dtypes[header.descr];

		let nums = new dtype["arrayConstructor"](arrayBufferContents, offsetBytes);

		//console.log(nums);

		return {
			dtype: dtype.name,
			data: nums,
			shape,
			fortranOrder: header.fortran_order,
		};
	}

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
				if (fh.ok) {
					return fh
						.blob()
						.then((i) => {
							var content = i;
							console.log(content);
							return self.readFileAsync(content).then((res) => {
								// var text = res.result;
								var result = self.parse(res);
								if (callback) {
									return callback(result);
								}
								//console.log(result);
								return result;
							});
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => console.error(err));
	}

	async load2(filename, callback) {
		return fetch(filename)
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				let noNewLines = text.replace(/\n/g, " ");

				var textByLine = noNewLines.split(" ");
				textByLine.pop();
				return textByLine;
			});
	}
}

module.exports = readTxt;
