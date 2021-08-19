import ImageChannels from "./ImageChannels";
import TransparencySlider from "./TransparencySlider";
import Label from "./Label";

import "./AtlasOptions.css";

const AtlasOptions = (props) => {
	const {
		channel,
		setChannel,
		showHiRes,
		setShowHiRes,
		showLabels,
		setShowLabels,
		labelsTransparency,
		setLabelsTransparency,
		currentLabel,
	} = props;

	return (
		<section className="options-container">
			<div className="scrollbar"></div>

			<div className="atlas-navigation">Atlas navigation</div>

			<div
				className="show-labels-container"
				onClick={() => setShowLabels(!showLabels)}
			>
				<button className="show-labels-btn">
					{showLabels ? "Hide" : "Show"} labels
				</button>
			</div>

			<Label showLabels={showLabels} currentLabel={currentLabel} />

			<TransparencySlider
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
			/>

			<ImageChannels channel={channel} setChannel={setChannel} />

			<div className="hi-res" onClick={() => setShowHiRes(!showHiRes)}>
				<button>{showHiRes ? "Hide" : "Show"} hi-res histology</button>
			</div>
		</section>
	);
};

export default AtlasOptions;
