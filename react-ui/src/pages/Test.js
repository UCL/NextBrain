import npyjs from "npyjs";
import ndarray from "ndarray";

import matrixMultiplier from "../components/utils/matrixMultiplier";

import arrayF from "../assets/P57-16/mri/indices_axial/slice_149.npy";
import arrayC from "../assets/P57-16/mri/indices_axial/slice_149.npy"; // remember to put this back as c order

const Test = () => {
	let n = new npyjs();

	const getNpyFortran = async () => {
		n.ajax(arrayF, (npyArray) => {
			console.log("FORTRAN ORDER REVERSED");
			console.log(npyArray);

			// const sliceIndices = ndarray(npyArray.data, npyArray.shape);
			// console.log(reversed);
			// console.log(reversed.get(29, 271));

			// initialise the ndarray with a stride that conforms to C contiguity
			// this is done by editing the stride
			// original Fortran contiguity stride = [448, 1] (which is the same as stride = [data.shape[1], 1])
			// transforming this stride to C contiguous = [1, 224] (which is the same as stride = [1, data.shape[0]])
			// this allows us to access array indexes correctly
			// for more info see https://ajcr.net/stride-guide-part-2/
			var reversedStride = ndarray(
				npyArray.data,
				npyArray.shape,
				[1, npyArray.shape[0]],
				npyArray.offset
			);
			console.log(reversedStride);
			console.log(reversedStride.get(29, 264));
		});
	};

	// getNpyFortran();

	const getNpyC = async () => {
		n.ajax(arrayC, (npyArray) => {
			console.log("C ORDER");
			console.log(npyArray);

			const sliceIndices = ndarray(npyArray.data, npyArray.shape);
			console.log(sliceIndices);
			console.log(sliceIndices.get(29, 264));

			// var reversedStride = ndarray(npyArray.data, [448, 224], [448, 1], 0);
			// console.log(reversedStride);
			// console.log(reversedStride.get(29, 271));
		});
	};

	// getNpyC();

	const getNpyTest = async () => {
		const npyArray = await n.load(arrayC);
		console.log(npyArray);
		console.log("jj");

		const sliceIndices = ndarray(npyArray.data, npyArray.shape);
		console.log(sliceIndices);
		console.log(sliceIndices.get(51, 110));

		var reversedStride = ndarray(
			npyArray.data,
			npyArray.shape,
			[1, npyArray.shape[0]],
			npyArray.offset
		);
		console.log(reversedStride);
		console.log(reversedStride.get(47, 80));
	};

	getNpyTest();

	let brainMatrix = [
		0.31385434307807203, -3.664457652247729, 1.6199030926177134,
		666.0080271821023, -0.7744411837137424, 1.4870493065731998,
		3.6535143658756977, -139.31333561581766, -1.2110952755381341,
		-0.18593341100766062, -0.1914204859080043, 118.27995513465419, 0.0, 0.0,
		0.0, 1.0,
	];

	let result = matrixMultiplier(brainMatrix, [47, 80, 103, 1]);
	console.log(result);

	return <main>Welcome to Brain Atlas, currently under construction</main>;
};

export default Test;
