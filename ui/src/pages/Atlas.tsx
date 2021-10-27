import { FC, useState, useEffect } from "react";

import { ASSETS_URL } from "../components/utils/ASSETS_URL";
import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";

import { CurrentLabel } from "../models/label.model";
import { AtlasImagesDimensionsKey } from "../models/atlasImagesDimensionsKey.model";
import { NavPanelCoords } from "../models/navPanelCoords.model";

import "./Atlas.css";

const Atlas: FC = () => {
	const [patientId, setPatientId] = useState("BrainAtlas-P57-16/main/P57-16");
	const [channel, setChannel] = useState("LFB");
	const [showHiRes, setShowHiRes] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState("0.5");
	const [currentLabel, setCurrentLabel] = useState<CurrentLabel | null>(null);
	const [navPanelCoords, setNavPanelCoords] = useState<NavPanelCoords | null>(
		null
	);
	const [atlasImagesDimensionsKey, setAtlasImagesDimensionsKey] =
		useState<AtlasImagesDimensionsKey | null>(null);

	// load in some helper files at app start-up
	useEffect(() => {
		const getAtlasImageDimensionsFiles = async () => {
			const mriDimensionsKeyUrl = `${ASSETS_URL}${patientId}/mriDimensionsKey.json`;
			const histologyLowResDimensionsKeyUrl = `${ASSETS_URL}${patientId}/histologyDimensionsKey.json`;
			const histologyHiResDimensionsKeyUrl = `${ASSETS_URL}${patientId}/histologyHRDimensionsKey.json`;

			const mriDimensionsKeyFile = await (
				await fetch(mriDimensionsKeyUrl)
			).json();

			const histologyLowResDimensionsKeyFile = await (
				await fetch(histologyLowResDimensionsKeyUrl)
			).json();

			const histologyHiResDimensionsKeyFile = await (
				await fetch(histologyHiResDimensionsKeyUrl)
			).json();

			const atlasImagesDimensionsKey = {
				mriDimensions: mriDimensionsKeyFile,
				histologyLowResDimensions: histologyLowResDimensionsKeyFile,
				histologyHiResDimensions: histologyHiResDimensionsKeyFile,
			};

			console.log(atlasImagesDimensionsKey);

			setAtlasImagesDimensionsKey(atlasImagesDimensionsKey);
		};

		getAtlasImageDimensionsFiles();
	}, [patientId]);

	if (atlasImagesDimensionsKey == null) {
		return <div>Loading atlas assets, this might take a few seconds...</div>;
	}

	return (
		<main className="atlas-container">
			<AtlasImages
				patientId={patientId}
				channel={channel}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setCurrentLabel={setCurrentLabel}
				navPanelCoords={navPanelCoords}
				atlasImagesDimensionsKey={atlasImagesDimensionsKey}
			/>

			<AtlasOptions
				patientId={patientId}
				setPatientId={setPatientId}
				channel={channel}
				setChannel={setChannel}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				showLabels={showLabels}
				setShowLabels={setShowLabels}
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
				currentLabel={currentLabel}
				setNavPanelCoords={setNavPanelCoords}
			/>

			{/* ideally, scrollbars should go here */}
			{/* <Scrollbars
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
				histologyScrollbarPos={histologyScrollbarPos}
				setHistologyScrollbarPos={setHistologyScrollbarPos}
			/> */}
		</main>
	);
};

export default Atlas;
