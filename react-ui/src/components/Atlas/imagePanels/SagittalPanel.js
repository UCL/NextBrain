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

	console.log(props.mriSlices);

	return (
		<div className="side-panel sagittal">
			<div>sagittal</div>
			<img
				className="sagittal-image"
				src={sagittalImage}
				alt="sagittal-image"
			></img>
			<div>
				{Object.keys(props.mriSlices.sagittal).map((prop) => (
					<>
						<div>
							<strong>{prop}: </strong>
							<strong>{props.mriSlices["sagittal"][prop]} </strong>
						</div>
					</>
				))}
			</div>
		</div>
	);
};

export default SagittalPanel;
