import { FC, useState, useEffect, useCallback } from "react";

import { ASSETS_URL } from "../components/utils/ASSETS_URL";
import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";

import { CurrentLabel } from "../models/label.model";
import { AtlasImagesDimensionsKey } from "../models/atlasImagesDimensionsKey.model";
import { NavPanelCoords } from "../models/navPanelCoords.model";

import "./Atlas.css";

const Atlas: FC = () => {
	const [initializeAtlas, setInitializeAtlas] = useState(true);
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
	const getAtlasImageDimensionsFiles = useCallback(async () => {
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
	}, [patientId]);

	useEffect(() => {
		const initializeAtlas = async () => {
			setInitializeAtlas(true);
			await getAtlasImageDimensionsFiles();
			setInitializeAtlas(false);
		};

		initializeAtlas();
	}, [patientId, getAtlasImageDimensionsFiles]);

	if (initializeAtlas === true) {
		return (
			<div>
				Initializing atlas and loading assets, this might take a few seconds
				depending on your internet connection...
			</div>
		);
	}

	if (atlasImagesDimensionsKey == null) {
		return <div>Error: could not load assets from remote storage</div>;
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
