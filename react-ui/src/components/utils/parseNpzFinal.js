export default class npyjs {
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
		// let nums2 = new Uint16Array(arrayBufferContents.slice(64));
		// console.log(nums2);

		// const version = arrayBufferContents.slice(6, 8); // Uint8-encoded
		const headerLength = arrayBufferContents[8];
		console.log(headerLength);

		const offsetBytes = 10 + headerLength;

		let hcontents = new TextDecoder("utf-8").decode(
			new Uint8Array(arrayBufferContents.slice(0, 20000))
		);

		console.log(hcontents);

		var header = JSON.parse(
			hcontents
				.toLowerCase() // True -> true
				.replace(/'/g, '"')
				.replace("(", "[")
				.replace(/,*\),*/g, "]")
		);

		console.log(header);

		var shape = header.shape;

		let dtype = this.dtypes[header.descr];

		let nums = new dtype["arrayConstructor"](arrayBufferContents, 63);
		//let nums = new Uint8Array(arrayBufferContents, offsetBytes);

		let nums2 = new Uint16Array(arrayBufferContents.slice(64));
		console.log(nums2);

		console.log(nums);

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

	async load(content, callback) {
		/*
        Loads an array from a stream of bytes.
        */
		let self = this;

		var result = self.parse(content);
		if (callback) {
			return callback(result);
		}
		return result;
	}
}
