import "./Label.css";

const Label = (props) => {
	const { showLabels, currentLabel } = props;

	// initialise the label on page load?
	if (currentLabel === null) {
		return <div>no label found</div>;
	}

	if (!showLabels) {
		return <div>Not showing labels</div>;
	}

	return (
		<div className="label-container">
			<div>Current Label:</div>

			<div className="label-indicator">
				<div
					className="label-color-box"
					style={{
						backgroundColor: `rgba(${currentLabel[2]},
								${currentLabel[3]},
								${currentLabel[4]},
								100
							)`,
						marginBottom: "10px",
					}}
				></div>

				<div>{currentLabel[1]}</div>
			</div>
		</div>
	);
};

export default Label;
