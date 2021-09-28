import { FC, useEffect } from "react";

import npyjs from "npyjs";
import ndarray from "ndarray";

import parseNpz from "../components/utils/parseNpz";

import getMatrix from "../components/utils/getMatrix";
import matrixMultiplier from "../components/utils/matrixMultiplier";
import histologySliceMap from "../components/utils/histologySliceMap";

const Atlas: FC = () => {
	useEffect(() => {
		// initialize mri panels based on an arbitrary starting point
		const runTest = async () => {
			console.log("hello");

			let n = new parseNpz();

			let npyFile = await require(`../assets/sparse_matrix.npz`);

			console.log(npyFile);

			const npyArray = await n.load(npyFile);

			console.log(npyArray);
		};

		runTest();
	}, []);

	return <main>Test page</main>;
};

export default Atlas;
