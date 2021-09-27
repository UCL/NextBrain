import { FC } from "react";

import "./TransparencySlider.css";

interface Props {
	showLabels: boolean;
	labelsTransparency: string;
	setLabelsTransparency: (labelsTransparency: string) => void;
}

const TransparencySlider: FC<Props> = (props) => {
	const { showLabels, labelsTransparency, setLabelsTransparency } = props;

	if (!showLabels) {
		return null;
	}

	return (
		<div className="transparency-slider-container">
			<span>Adjust label transparency</span>
			<input
				type="range"
				name="labels-transparency"
				id="labels-transparency"
				className="labels-transparency-slider"
				value={labelsTransparency}
				onChange={(e) => {
					setLabelsTransparency(e.target.value);
				}}
				min="0"
				max="1"
				step="0.01"
				disabled={showLabels ? false : true}
			/>
		</div>
	);
};

export default TransparencySlider;
