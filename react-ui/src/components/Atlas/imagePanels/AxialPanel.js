import "./AxialPanel.css";

const AxialPanel = (props) => {
	const axialSlice = require(`../../../assets/mri/slices_axial/${props.mriSlices["axial"]["slice"]}.png`)
		.default;

	return (
		<div className="side-panel axial">
			<img className="axial-image" src={axialSlice} alt="axial-image"></img>
		</div>
	);
};

export default AxialPanel;
