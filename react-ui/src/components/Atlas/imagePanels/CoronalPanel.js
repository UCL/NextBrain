import "./CoronalPanel.css";

// const sagittalImages = require.context(
// 	"../../assets/mri/slices_sagittal",
// 	true
// );

const CoronalPanel = () => {
	function importAll(r) {
		let images = {};
		r.keys().map((item, index) => {
			images[item.replace("./", "")] = r(item);
		});
		return images;
	}

	const coronalImages = importAll(
		require.context(
			"../../../assets/mri/slices_sagittal",
			false,
			/\.(png|jpe?g|svg)$/
		)
	);

	return (
		<div className="side-panel coronal">
			<img
				className="coronal-image"
				//src={coronalImages["slice_025.png"]["default"]}
				alt="coronal-image"
			></img>
		</div>
	);
};

export default CoronalPanel;
