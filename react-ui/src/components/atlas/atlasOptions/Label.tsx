import { FC } from "react";

import { CurrentLabel } from "../../../models/label.model";

import "./Label.css";

interface Props {
	showLabels: boolean;
	currentLabel: CurrentLabel | null;
}

const Label: FC<Props> = (props) => {
	const { showLabels, currentLabel } = props;

	console.log(currentLabel);

	if (!showLabels) {
		return null;
	}

	// initialise the label on page load?
	if (currentLabel == null) {
		return <div>no label found</div>;
	}

	// make the label an object so it is more clear what its contents are
	return (
		<div className="label-container">
			<div className="label-heading">Current Label</div>

			<div className="label-name">Label name: {currentLabel.labelName}</div>

			<div className="label-color-container">
				<span> Label color: </span>
				<span
					className="label-color-box"
					style={{
						backgroundColor: `rgba(${currentLabel.r},
								${currentLabel.g},
								${currentLabel.b},
								100
							)`,
						marginBottom: "10px",
					}}
				></span>
			</div>
		</div>
	);
};

export default Label;
