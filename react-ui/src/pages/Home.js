import npyjs from "../components/utils/npy";
import ndarray from "ndarray";

import file from "../assets/slice_102_C.npy";

import "./Home.css";

const Atlas = () => {
	let n = new npyjs();

	const getNpy = async () => {
		n.ajax(file, (npyArray) => {
			console.log(npyArray);

			const sliceIndices = ndarray(npyArray.data, npyArray.shape);
			console.log(sliceIndices);
			console.log(sliceIndices.get(47, 80));
		});
	};

	getNpy();

	const multiplyMatrixAndPoint = (matrix, point) => {
		// Give a variable name to each part of the matrix, a column and row number
		let c0r0 = matrix[0],
			c1r0 = matrix[1],
			c2r0 = matrix[2],
			c3r0 = matrix[3];
		let c0r1 = matrix[4],
			c1r1 = matrix[5],
			c2r1 = matrix[6],
			c3r1 = matrix[7];
		let c0r2 = matrix[8],
			c1r2 = matrix[9],
			c2r2 = matrix[10],
			c3r2 = matrix[11];
		let c0r3 = matrix[12],
			c1r3 = matrix[13],
			c2r3 = matrix[14],
			c3r3 = matrix[15];

		// set some names for the point
		let x = point[0];
		let y = point[1];
		let z = point[2];
		let w = point[3];

		// perform matrix multiplication operations
		// for a worked example of matrix multiplication see https://matrix.reshish.com/multCalculation.php
		let resultX = x * c0r0 + y * c1r0 + z * c2r0 + w * c3r0;
		let resultY = x * c0r1 + y * c1r1 + z * c2r1 + w * c3r1;
		let resultZ = x * c0r2 + y * c1r2 + z * c2r2 + w * c3r2;
		let resultW = x * c0r3 + y * c1r3 + z * c2r3 + w * c3r3;

		return [resultX, resultY, resultZ, resultW];
	};

	let identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	let brainMatrix = [
		0.31385434307807203, -3.664457652247729, 1.6199030926177134,
		666.0080271821023, -0.7744411837137424, 1.4870493065731998,
		3.6535143658756977, -139.31333561581766, -1.2110952755381341,
		-0.18593341100766062, -0.1914204859080043, 118.27995513465419, 0.0, 0.0,
		0.0, 1.0,
	];

	let result = multiplyMatrixAndPoint(brainMatrix, [47, 80, 103, 1]);
	console.log(result);

	return <main>Welcome to Brain Atlas, currently under construction</main>;
};

export default Atlas;
