import { FC } from "react";

import HistologyScrollbar from "./HistologyScrollbar";
import AtlasNavigation from "./AtlasNavigation";
import LabelsBtn from "./LabelsBtn";
import TransparencySlider from "./TransparencySlider";
import Label from "./Label";
import ImageChannels from "./ImageChannels";
import HiResBtn from "./HiResBtn";

import { CurrentLabel } from "../../../models/label.model";

import "./AtlasOptions.css";

interface Props {
	channel: string;
	setChannel: (channel: string) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	showLabels: boolean;
	setShowLabels: (showLabels: boolean) => void;
	labelsTransparency: string;
	setLabelsTransparency: (labelsTransparency: string) => void;
	currentLabel: CurrentLabel;
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
}

const AtlasOptions: FC<Props> = (props) => {
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
		histologyScrollbarPos,
		setHistologyScrollbarPos,
	} = props;

	return (
		<div className="options-container">
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
