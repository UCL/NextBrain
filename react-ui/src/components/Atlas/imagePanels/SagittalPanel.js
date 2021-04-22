import "./SagittalPanel.css";

const SagittalPanel = (props) => {
	var sagittalImages = require(`../../../assets/mri/slices_sagittal/${props.slice}.png`)
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

	console.log(sagittalImages);

	return (
		<div className="side-panel sagittal">
			<img
				className="sagittal-image"
				//src={sagittalImages["slice_025.png"]["default"]}
				src={sagittalImages}
				alt="sagittal-image"
			></img>
		</div>
	);
};

export default SagittalPanel;
