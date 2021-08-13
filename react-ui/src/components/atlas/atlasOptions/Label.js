import "./Label.css";

const Label = (props) => {
	const { showLabels } = props;

	return (
		<div className="label-container">
			<div>Current Label:</div>

			<div className="label-indicator">
				<div className="label-color-box"></div>
				<div>{showLabels ? "Label" : "N / A"}</div>
			</div>
		</div>
	);
};

export default Label;
