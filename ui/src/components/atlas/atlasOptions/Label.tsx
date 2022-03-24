import { FC, useState, useEffect } from "react";

import LoadingSpinner from "../../shared/LoadingSpinner";

import { CurrentLabel } from "../../../models/label.model";

import "./Label.css";

interface Props {
	showLabels: boolean;
	currentLabel: CurrentLabel | null;
}

const Label: FC<Props> = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	const { showLabels, currentLabel } = props;

	useEffect(() => {
		// show a loading spinner while the label is being fetched
		currentLabel === null ? setIsLoading(true) : setIsLoading(false);
	}, [currentLabel]);

	if (!showLabels) {
		return null;
	}

	if (currentLabel === null) {
		return (
			<div>
				{isLoading && (
					<LoadingSpinner asOverlay={false} message={"Fetching label..."} />
				)}
			</div>
		);
	}

	if (currentLabel === undefined) {
		return <div>no label found</div>;
	}

	return (
		<div className="label-container">
			{currentLabel != null && (
				<>
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
				</>
			)}
		</div>
	);
};

export default Label;
