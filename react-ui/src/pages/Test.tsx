import { FC, useEffect } from "react";

import npyjs from "npyjs";
import ndarray from "ndarray";

import pako from "pako";
import JSZip from "jszip";

import parseNpy from "../components/utils/parseNpy";
import parseNpz_uncompressed from "../components/utils/parseNpz_uncompressed";
import parseNpz_compressed from "../components/utils/parseNpz_compressed";
import zipTest from "../components/utils/zipTest";
import npzAsArrayBuffer from "../components/utils/npzAsArrayBuffer";
import parseNpzFinal from "../components/utils/parseNpzFinal";

const Atlas: FC = () => {
	// testing out zipping a .npy file
	// useEffect(() => {
	// 	const runZipTest = async () => {
	// 		// this function takes an uncompressed .npy file, zips it, unzips it, and then inspects the contents
	// 		// this is a proof of concept to show that we can process zipped npy files
	// 		// as a last resort, all of the .npy files could be zipped by us in node.js

	// 		let n = new zipTest();

	// 		// load an uncompressed file
	// 		let file = await require(`../assets/zip_test/final_test/slice_02_big.npy`)
	// 			.default;

	// 		const parsedFile = await n.load(file); // returns an unparsed uint8Array (so just the full raw contents)

	// 		console.log(parsedFile);

	// 		try {
	// 			// zip the uncompressed npy file
	// 			const compressedFile = pako.deflate(parsedFile);
	// 			console.log(compressedFile);

	// 			let contents2 = new TextDecoder("utf-8").decode(
	// 				new Uint8Array(compressedFile.slice(0, 100))
	// 			);
	// 			console.log(contents2);

	// 			// unzip the file
	// 			const uncompressedFile = pako.inflate(compressedFile);
	// 			console.log(uncompressedFile);

	// 			// inspect its raw contents
	// 			let contents = new TextDecoder("utf-8").decode(
	// 				new Uint8Array(uncompressedFile.slice(0, 100))
	// 			);
	// 			console.log(contents);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	runZipTest();
	// }, []);

	// useEffect(() => {
	// 	const processNpzFile = async () => {
	// 		let n = new zipTest();

	// 		let file =
	// 			await require(`../assets/zip_test/final_test/slice_02_big_npz_compressed.zip`)
	// 				.default;

	// 		const parsedFile = await n.load(file); // returns an unparsed uint8Array (so just the full raw contents)

	// 		console.log(parsedFile);

	// 		const slicedFile = new Uint8Array(parsedFile!.slice(52));

	// 		let contents = new TextDecoder("utf-8").decode(
	// 			new Uint8Array(parsedFile!.slice(54, 1000))
	// 		);
	// 		console.log(contents);

	// 		try {
	// 			// zip the uncompressed npy file
	// 			// const compressedFile = pako.deflate(parsedFile);
	// 			// console.log(compressedFile);

	// 			// unzip the file
	// 			const uncompressedFile = pako.inflateRaw(parsedFile);
	// 			console.log(uncompressedFile);

	// 			// inspect its raw contents
	// 			let contents = new TextDecoder("utf-8").decode(
	// 				new Uint8Array(uncompressedFile.slice(0, 1000))
	// 			);
	// 			console.log(contents);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	processNpzFile();
	// }, []);

	// useEffect(() => {
	// 	const runZipTest = async () => {
	// 		// this function takes an uncompressed .npy file, zips it, unzips it, and then inspects the contents
	// 		// this is a proof of concept to show that we can process zipped npy files
	// 		// as a last resort, all of the .npy files could be zipped by us in node.js

	// 		let n = new parseNpy();

	// 		// load an uncompressed file
	// 		let file = await require(`../assets/zip_test/final_test/slice_02_big.npy`)
	// 			.default;

	// 		const parsedFile = await n.load(file); // returns an unparsed uint8Array (so just the full raw contents)

	// 		console.log(parsedFile);

	// 		let ndArray = ndarray(parsedFile.data, parsedFile.shape);
	// 		const label = ndArray.get(5000, 4000);
	// 		console.log(label);

	// 		// try {
	// 		// 	// zip the uncompressed npy file
	// 		// 	const compressedFile = pako.deflate(parsedFile);
	// 		// 	console.log(compressedFile);

	// 		// 	let contents2 = new TextDecoder("utf-8").decode(
	// 		// 		new Uint8Array(compressedFile.slice(0, 100))
	// 		// 	);
	// 		// 	console.log(contents2);

	// 		// 	// unzip the file
	// 		// 	const uncompressedFile = pako.inflate(compressedFile);
	// 		// 	console.log(uncompressedFile);

	// 		// 	// inspect its raw contents
	// 		// 	let contents = new TextDecoder("utf-8").decode(
	// 		// 		new Uint8Array(uncompressedFile.slice(0, 100))
	// 		// 	);
	// 		// 	console.log(contents);
	// 		// } catch (err) {
	// 		// 	console.log(err);
	// 		// }
	// 	};

	// 	runZipTest();
	// }, []);

	useEffect(() => {
		const processNpzFile = async () => {
			let n = new npzAsArrayBuffer();
			let zip = new JSZip();

			const file =
				await require(`../assets/zip_test/final_test/slice_02_big_npz_compressed.npz`)
					.default;

			const npzArrayBuffer = await n.load(file); // returns raw contents as an unparsed array buffer
			console.log(npzArrayBuffer);

			const npzUint8Array = new Uint8Array(npzArrayBuffer); // parse the arrayBuffer as a uint8Array
			console.log(npzUint8Array);

			const loadedZip = await zip.loadAsync(npzUint8Array!); // get all files in the zip
			console.log(loadedZip);

			// parse the loaded zip as an arrayBuffer
			const unzippedArrayBuffer = await loadedZip
				.file("arr_0.npy")!
				.async("arraybuffer");
			console.log(unzippedArrayBuffer);

			// we need to parse both the uint8array data and the uint16 array data from the zip
			// we get the header info from the unit8 data
			// and we get the actual npy array data from the uint16 data
			// although it seems to work, this seems weird, so i'm probably just missing something

			// create the header data from the uint8Array data
			let headerData = new Uint8Array(unzippedArrayBuffer);
			let hcontents = new TextDecoder("utf-8").decode(
				new Uint8Array(headerData.slice(10, 10 + 118))
			);
			var header = JSON.parse(
				hcontents
					.toLowerCase() // True -> true
					.replace(/'/g, '"')
					.replace("(", "[")
					.replace(/,*\),*/g, "]")
			);
			console.log(header);

			// get the npy array data from the uint16array
			let npyData = new Uint16Array(unzippedArrayBuffer.slice(128));
			console.log(npyData);

			// process the array data accordingly
			let ndArray = ndarray(npyData, header.shape);
			const label = ndArray.get(5000, 2906);
			console.log(label);
		};

		processNpzFile();
	}, []);

	return <main>Test page</main>;
};

export default Atlas;
