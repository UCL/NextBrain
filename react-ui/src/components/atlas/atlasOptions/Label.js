import "./Label.css";

const Label = (props) => {
	const { showLabels, currentLabel } = props;

	console.log(currentLabel);

	if (currentLabel === null) {
		return <div>no label found</div>;
	}

	return (
		<div className="label-container">
			<div>Current Label:</div>

			<div className="label-indicator">
				{showLabels && (
					<div
						className="label-color-box"
						style={{
							backgroundColor: `rgba(${currentLabel[2]},
								${currentLabel[3]},
								${currentLabel[4]},
								100
							)`,
						}}
						//style={{ backgroundColor: "rgba(41,10,100,100)" }}
					></div>
				)}

				<div>{showLabels ? `${currentLabel[1]}` : "N / A"}</div>
			</div>
		</div>
	);
};

export default Label;
