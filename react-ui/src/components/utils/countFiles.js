const countFiles = (blockNumber) => {
	const blockData = {
		"01": importAll(
			require.context("../../assets/P57-16/histology/01/slices_HE")
		),
	};

	// see if I can build the function dynamically
	// let data2 = {};
	// for (let i = 0; i < 10; i++) {
	// 	data2[i] = importAll(
	// 		require.context("../../assets/P57-16/histology/0" + i + "/slices_HE")
	// 	);
	// }
	// console.log(data2);

	const files = blockData.hasOwnProperty(blockNumber)
		? blockData[blockNumber]
		: "Not found!";

	console.log(files);
	console.log(Object.keys(files).length);

	return Object.keys(files).length;
};

const importAll = (r) => {
	console.log("importing all");
	let images = {};
	r.keys().map((item, index) => {
		images[item.replace("./", "")] = r(item);
	});
	return images;
};

export default countFiles;
