import "./AxialPanel.css";

const AxialPanel = (props) => {
	const axialSlice = require(`../../../assets/mri/slices_axial/${props.mriSlices["axial"]["slice"]}.png`)
		.default;

	return (
		<div className="side-panel axial">
			{/* <div>axial</div> */}
			<img className="axial-image" src={axialSlice} alt="axial-image"></img>
			{/* <div>
				{Object.keys(props.mriSlices.axial).map((prop) => (
					<>
						<div>
							<strong>{prop}: </strong>
							<strong>{props.mriSlices["axial"][prop]} </strong>
						</div>
					</>
				))}
			</div> */}
		</div>
	);
};

export default AxialPanel;
