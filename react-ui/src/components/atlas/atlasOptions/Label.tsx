import { FC } from "react";

import { CurrentLabel } from "../../../models/label.model";

import "./Label.css";

interface Props {
	showLabels: boolean;
	currentLabel: CurrentLabel;
}

const Label: FC<Props> = (props) => {
	const { showLabels, currentLabel } = props;

	console.log(currentLabel);

	if (!showLabels) {
		return null;
	}

	// initialise the label on page load?
	if (currentLabel === null) {
		return <div>no label found</div>;
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
