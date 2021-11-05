import JSZip from "jszip";

export default class npzParser {
	async readFileAsync(file: Blob) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;

			reader.readAsArrayBuffer(file);
		});
	}

	// uncompresses and parses a raw .npz file
	async parseNpz(arrayBuffer: ArrayBuffer) {
		let zip = new JSZip();

		const npzUint8Array = new Uint8Array(arrayBuffer); // parse the arrayBuffer as a uint8Array

		const loadedZip = await zip.loadAsync(npzUint8Array); // get all files in the zip

		const fileName = Object.entries(loadedZip.files)[0][0]; // the name of the file inside the zip file

		// parse the loaded zip as an arrayBuffer
		const unzippedArrayBuffer = await loadedZip
			.file(fileName)!
			.async("arraybuffer");

		// we need to parse both the uint8array data and the uint16 array data from the zip
		// we get the header info from the unit8 data
		// and we get the npy array data from the uint16 data (because the data is encoded as int16)

		// create the header data from the uint8Array data
		const headerData = new Uint8Array(unzippedArrayBuffer);
		const hcontents = new TextDecoder("utf-8").decode(
			new Uint8Array(headerData.slice(10, 10 + 118))
		);

		const header = JSON.parse(
			hcontents
				.toLowerCase() // True -> true
				.replace(/'/g, '"')
				.replace("(", "[")
				.replace(/,*\),*/g, "]")
		);

		// get the npy array data from the uint16array
		const npyData = {
			data: new Uint16Array(unzippedArrayBuffer.slice(128)),
			header: header,
		};

		return npyData;
	}

	async load(filename: RequestInfo) {
		// Loads an array from a stream of bytes.
		const self = this;
		return fetch(filename)
			.then((fetchedFile) => {
				if (fetchedFile.ok) {
					return fetchedFile
						.blob()
						.then((blobData) => {
							return self.readFileAsync(blobData).then((arrayBuffer) => {
								return self.parseNpz(arrayBuffer as ArrayBuffer);
							});
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
}
