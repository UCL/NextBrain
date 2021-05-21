const fetch = window.fetch;

class npyjs {
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
		console.log(hcontents);

		var header = JSON.parse(
			hcontents
				.replace(/'/g, '"')
				.replace("True", "true")
				.replace("False", "false")
				.replace("(", "[")
				.replace(/,*\),*/g, "]")
		);
		var shape = header.shape;

		let dtype = this.dtypes[header.descr];

		let nums = new dtype["arrayConstructor"](arrayBufferContents, offsetBytes);

		//console.log(nums);

		return {
			dtype: dtype.name,
			data: nums,
			shape,
		};
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
							console.log(content);
							var reader = new FileReader();
							reader.addEventListener("loadend", function () {
								var text = reader.result;
								var res = self.parse(text);
								if (callback) {
									return callback(res);
								}
								//console.log(res);
								return res;
							});
							reader.readAsArrayBuffer(content);
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => console.error(err));
	}

	async ajax(url, callback) {
		let self = this;
		var xhr = new XMLHttpRequest();
		xhr.onload = function (e) {
			var buf = xhr.response; // not responseText
			var ndarray = self.parse(buf);
			callback(ndarray);
		};
		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.send(null);
	}

	async load2(url) {
		fetch(url)
			.then((d) => {
				console.log(d);
				d.arrayBuffer();
			})
			.then((d) => new npyjs().parse(d))
			.then((data) => console.log(data));
	}
}

module.exports = npyjs;
