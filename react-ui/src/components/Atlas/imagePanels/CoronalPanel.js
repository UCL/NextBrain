import "./CoronalPanel.css";

const CoronalPanel = (props) => {
	const paddedSlice = props.mriSlices["coronal"]["slice"]
		.toString()
		.padStart(3, 0);
	const coronalSlice = require(`../../../assets/mri/slices_coronal/slice_${paddedSlice}.png`)
		.default;

	return (
		<div className="side-panel coronal">
			{/* <div>coronal</div> */}
			<img
				className="coronal-image"
				src={coronalSlice}
				alt="coronal-image"
			></img>
			{/* <div>
				{Object.keys(props.mriSlices.coronal).map((prop) => (
					<>
						<div>
							<strong>{prop}: </strong>
							<strong>{props.mriSlices["coronal"][prop]} </strong>
						</div>
					</>
				))}
			</div> */}
		</div>
	);
};

export default CoronalPanel;
