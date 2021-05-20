const fetch = window.fetch;

class npy2js {
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
			"|i1": {
				name: "int8",
				size: 8,
				arrayConstructor: Int8Array,
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
		console.log(arrayBufferContents);

		//const version = arrayBufferContents.slice(6, 8); // Uint8-encoded
		const headerLength = new DataView(
			arrayBufferContents.slice(8, 10)
		).getUint8(0);
		//console.log(headerLength)

		// console.log(new DataView(arrayBufferContents));
		// console.log(new DataView(arrayBufferContents.slice(8, 10)));
		//console.log(new DataView(arrayBufferContents.slice(8, 10)).getUint8(0));
		const offsetBytes = 10 + headerLength;

		let hcontents = new TextDecoder("utf-8").decode(
			new Uint8Array(arrayBufferContents.slice(10, 10 + headerLength))
		);

		let test = new TextDecoder("utf-8").decode(
			new Uint8Array(arrayBufferContents.slice(10, 1000))
		);

		console.log(test);

		var header = JSON.parse(
			hcontents
				.replace(/'/g, '"')
				.replace("True", "true")
				.replace("False", "false")
				.replace("(", "[")
				.replace(/,*\),*/g, "]")
		);
		console.log(header);
		var shape = header.shape;

		let dtype = this.dtypes[header.descr];

		// let nums = new dtype["arrayConstructor"](
		//     arrayBufferContents,
		//     offsetBytes
		// );
		// console.log(nums)

		let nums = new Uint8Array(arrayBufferContents, offsetBytes);

		console.dir(nums, { maxArrayLength: 15000 });

		//console.log(nums[5000])

		return {
			dtype: dtype.name,
			data: nums,
			shape,
		};
	}

	// load(filename) {
	// 	var res = fs.readFileSync(filename, null);
	// 	var out = this.parse(res.buffer);
	// 	return out;
	// }

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
							var reader = new FileReader();
							reader.addEventListener("loadend", function () {
								var text = reader.result;
								var res = self.parse(text);
								if (callback) {
									return callback(res);
								}
								return res;
							});
							reader.readAsArrayBuffer(content);
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => console.error(err));
	}
}

module.exports = npy2js;
