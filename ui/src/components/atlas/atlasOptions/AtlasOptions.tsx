import { FC } from "react";

import PatientSelect from "./PatientSelect";
import AtlasNavigation from "./AtlasNavigation";
import ShowLabelsBtn from "./ShowLabelsBtn";
import TransparencySlider from "./TransparencySlider";
import Label from "./Label";
import ImageChannelSelect from "./ImageChannelSelect";
import ShowHiResBtn from "./ShowHiResBtn";

import { CurrentLabel } from "../../../models/label.model";
import { NavPanelCoords } from "../../../models/navPanelCoords.model";

import "./AtlasOptions.css";

interface Props {
	patientId: string;
	setPatientId: (patientId: string) => void;
	channel: string;
	setChannel: (channel: string) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	showLabels: boolean;
	setShowLabels: (showLabels: boolean) => void;
	labelsTransparency: string;
	setLabelsTransparency: (labelsTransparency: string) => void;
	currentLabel: CurrentLabel | null;
	setNavPanelCoords: (navPanelCoords: NavPanelCoords) => void;
}

const AtlasOptions: FC<Props> = (props) => {
	const {
		patientId,
		setPatientId,
		channel,
		setChannel,
		showHiRes,
		setShowHiRes,
		showLabels,
		setShowLabels,
		labelsTransparency,
		setLabelsTransparency,
		currentLabel,
		setNavPanelCoords,
	} = props;

	return (
		<div className="options-container">
			<PatientSelect patientId={patientId} setPatientId={setPatientId} />

			<AtlasNavigation
				patientId={patientId}
				setNavPanelCoords={setNavPanelCoords}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
			/>

			<ImageChannelSelect channel={channel} setChannel={setChannel} />

			<ShowLabelsBtn showLabels={showLabels} setShowLabels={setShowLabels} />

			<Label showLabels={showLabels} currentLabel={currentLabel} />

			<TransparencySlider
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
			/>

			<ShowHiResBtn showHiRes={showHiRes} setShowHiRes={setShowHiRes} />
		</div>
	);
};

export default AtlasOptions;
