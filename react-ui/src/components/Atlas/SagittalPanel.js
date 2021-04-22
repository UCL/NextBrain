import "./SagittalPanel.css";

// const sagittalImages = require.context(
// 	"../../assets/mri/slices_sagittal",
// 	true
// );

const SagittalPanel = () => {
	function importAll(r) {
		let images = {};
		r.keys().map((item, index) => {
			images[item.replace("./", "")] = r(item);
		});
		return images;
	}

	const sagittalImages = importAll(
		require.context(
			"../../assets/mri/slices_sagittal",
			false,
			/\.(png|jpe?g|svg)$/
		)
	);

	console.log(sagittalImages);

	return (
		<div className="side-panel sagittal">
			<img
				className="sagittal-image"
				src={sagittalImages["slice_025.png"]["default"]}
				alt="sagittal-image"
			></img>
		</div>
	);
};

export default SagittalPanel;
