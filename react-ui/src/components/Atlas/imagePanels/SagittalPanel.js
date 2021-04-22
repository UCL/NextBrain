import "./SagittalPanel.css";

const SagittalPanel = (props) => {
	const sagittalImage = require(`../../../assets/mri/slices_sagittal/${props.mriSlices["sagittal"]["slice"]}.png`)
		.default;

	// function importAll(r) {
	// 	let images = {};
	// 	r.keys().map((item, index) => {
	// 		images[item.replace("./", "")] = r(item);
	// 	});
	// 	return images;
	// }

	// const sagittalImages = importAll(
	// 	require.context(
	// 		"../../assets/mri/slices_sagittal",
	// 		false,
	// 		/\.(png|jpe?g|svg)$/
	// 	)
	// );

	console.log(sagittalImage);

	return (
		<div className="side-panel sagittal">
			<img
				className="sagittal-image"
				src={sagittalImage}
				alt="sagittal-image"
			></img>
		</div>
	);
};

export default SagittalPanel;
