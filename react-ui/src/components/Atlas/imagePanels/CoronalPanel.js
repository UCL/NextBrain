import "./CoronalPanel.css";

const CoronalPanel = (props) => {
	const coronalSlice = require(`../../../assets/mri/slices_coronal/${props.mriSlices["coronal"]["slice"]}.png`)
		.default;

	return (
		<div className="side-panel coronal">
			<img
				className="coronal-image"
				src={coronalSlice}
				alt="coronal-image"
			></img>
		</div>
	);
};

export default CoronalPanel;
