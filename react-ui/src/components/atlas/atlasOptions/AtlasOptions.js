import ImageChannels from "./ImageChannels";
import TransparencySlider from "./TransparencySlider";

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
	} = props;

	return (
		<section className="options-container">
			<div className="scrollbar"></div>

			<div className="atlas-navigation">Atlas navigation</div>

			<div className="show-labels" onClick={() => setShowLabels(!showLabels)}>
				<button>{showLabels ? "Hide" : "Show"} labels</button>
			</div>

			<TransparencySlider
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
			/>

			<ImageChannels channel={channel} setChannel={setChannel} />

			<div className="current-label"> Current label</div>

			<div className="hi-res" onClick={() => setShowHiRes(!showHiRes)}>
				<button>{showHiRes ? "Hide" : "Show"} hi-res histology</button>
			</div>
		</section>
	);
};

export default AtlasOptions;
