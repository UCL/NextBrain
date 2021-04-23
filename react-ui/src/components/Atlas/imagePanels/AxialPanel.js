import "./AxialPanel.css";

const AxialPanel = (props) => {
	const paddedSlice = props.mriSlices["axial"]["slice"]
		.toString()
		.padStart(3, 0);
	const axialSlice = require(`../../../assets/mri/slices_axial/slice_${paddedSlice}.png`)
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
