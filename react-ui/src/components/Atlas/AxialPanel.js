import "./AxialPanel.css";

// const sagittalImages = require.context(
// 	"../../assets/mri/slices_sagittal",
// 	true
// );

const AxialPanel = () => {
	function importAll(r) {
		let images = {};
		r.keys().map((item, index) => {
			images[item.replace("./", "")] = r(item);
		});
		return images;
	}

	const axialImages = importAll(
		require.context(
			"../../assets/mri/slices_sagittal",
			false,
			/\.(png|jpe?g|svg)$/
		)
	);

	return (
		<div className="side-panel axial">
			<img
				className="axial-image"
				src={coronalImages["slice_025.png"]["default"]}
				alt="axial-image"
			></img>
		</div>
	);
};

export default AxialPanel;
