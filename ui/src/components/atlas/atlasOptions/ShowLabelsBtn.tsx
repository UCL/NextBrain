import { FC } from "react";

import "./ShowLabelsBtn.css";

interface Props {
	showLabels: boolean;
	setShowLabels: (showLabels: boolean) => void;
}

const ShowLabelsBtn: FC<Props> = (props) => {
	const { showLabels, setShowLabels } = props;

	return (
		<button
			onClick={() => setShowLabels(!showLabels)}
			className="show-labels-btn"
		>
			{showLabels ? "Hide" : "Show"} labels
		</button>
	);
};

export default ShowLabelsBtn;
