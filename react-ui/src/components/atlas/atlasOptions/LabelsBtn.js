const LabelsBtn = (props) => {
	const { showLabels, setShowLabels } = props;

	return (
		<div
			className="show-labels-container"
			onClick={() => setShowLabels(!showLabels)}
		>
			<button className="show-labels-btn">
				{showLabels ? "Hide" : "Show"} labels
			</button>
		</div>
	);
};

export default LabelsBtn;
