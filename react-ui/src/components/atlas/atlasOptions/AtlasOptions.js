import HistologyScrollbar from "./HistologyScrollbar";
import AtlasNavigation from "./AtlasNavigation";
import LabelsBtn from "./LabelsBtn";
import TransparencySlider from "./TransparencySlider";
import Label from "./Label";
import ImageChannels from "./ImageChannels";
import HiResBtn from "./HiResBtn";

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
		<div className="options-container">
			<HistologyScrollbar />

			<AtlasNavigation />

			<LabelsBtn showLabels={showLabels} setShowLabels={setShowLabels} />

			<Label showLabels={showLabels} currentLabel={currentLabel} />

			<TransparencySlider
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
			/>

			<ImageChannels channel={channel} setChannel={setChannel} />

			<HiResBtn showHiRes={showHiRes} setShowHiRes={setShowHiRes} />
		</div>
	);
};

export default AtlasOptions;
