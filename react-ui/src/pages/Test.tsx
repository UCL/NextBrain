import { FC, useEffect } from "react";

import npyjs from "npyjs";
import ndarray from "ndarray";

import pako from "pako";
import JSZip from "jszip";

import parseNpy from "../components/utils/parseNpy";
import npzAsArrayBuffer from "../components/utils/npzAsArrayBuffer";

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
			let zip: any = new JSZip();

			let file =
				await require(`../assets/zip_test/final_test/block_38_slice_04.npz`)
					.default;

			let npzArrayBuffer: any = await n.load(file); // returns raw contents as an unparsed array buffer
			//console.log(npzArrayBuffer);

			let npzUint8Array: any = new Uint8Array(npzArrayBuffer); // parse the arrayBuffer as a uint8Array
			//console.log(npzUint8Array);

			let loadedZip: any = await zip.loadAsync(npzUint8Array!); // get all files in the zip
			//console.log(loadedZip);

			// parse the loaded zip as an arrayBuffer
			let unzippedArrayBuffer: any = await loadedZip
				.file("arr_0.npy")!
				.async("arraybuffer");
			//console.log(unzippedArrayBuffer);

			// we need to parse both the uint8array data and the uint16 array data from the zip
			// we get the header info from the unit8 data
			// and we get the actual npy array data from the uint16 data
			// although it seems to work, this seems weird, so i'm probably just missing something

			// create the header data from the uint8Array data
			let headerData: any = new Uint8Array(unzippedArrayBuffer);
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
			let npyData: any = new Uint16Array(unzippedArrayBuffer.slice(128));

			// process the array data accordingly
			let ndArray = ndarray(npyData, header.shape);
			console.log(ndArray);

			const label = ndArray.get(124, 300);
			console.log(label);
		};

		processNpzFile();
	}, []);

	// useEffect(() => {
	// 	const processNpzFile = async () => {
	// 		// const fileUrlJson =
	// 		// 	"https://raw.githubusercontent.com/jhughes982/brainAtlas-P57-16/main/WholeHemisphereFS.json";

	// 		// const fileJson = await fetch(fileUrlJson);

	// 		// const parsedFile = await fileJson.json();

	// 		// console.log(parsedFile);

	// 		// const fileUrl =
	// 		// 	"https://raw.githubusercontent.com/jhughes982/brainAtlas-P57-16/main/slice_000.npy";
	// 		const fileUrl =
	// 			"https://raw.githubusercontent.com/jhughes982/brainAtlas-P57-16/main/P57-16/mri_rotated/indices_axial/slice_000.npy";

	// 		const file = await fetch(fileUrl);

	// 		//const parsedFile = await file.text();

	// 		let n = new npyjs();

	// 		const npyArray = await n.load(fileUrl);

	// 		console.log(npyArray);
	// 	};

	// 	processNpzFile();
	// }, []);

	return (
		<div>
			<img
				src={"https://github.com/labnol/files/blob/master/trex.jpg?raw=true"}
				alt="kk"
			></img>
		</div>
	);
};

export default Atlas;
