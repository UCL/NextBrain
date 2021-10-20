import { FC, useState, useCallback, useEffect } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";
import getMatrix from "../components/utils/getMatrix";
import matrixMultiplier from "../components/utils/matrixMultiplier";
import { ASSETS_URL } from "../components/utils/ASSETS_URL";

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

	// loads in some helper files at app start-up
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

			setAtlasImagesDimensionsKey(atlasImagesDimensionsKey);
		};

		getAtlasImageDimensionsFiles();
	}, [patientId]);

	// useCallback prevents unnecessary re-render of child component (AtlasNavigation.tsx)
	const getNavPanelCoords = useCallback(
		async (navPanelCoords: NavPanelCoords) => {
			console.log(navPanelCoords);

			const matrix = await getMatrix(
				navPanelCoords!.blockNumber,
				"histology",
				patientId
			);

			// why is the order of params here different compared to the function that handles physical clicks?
			// the x and y are swapped here compared to the histologyToMri function
			// there must be some sort of flipping of axes somewhere
			// regardless, the app seems to work with this configuration
			const singleMriCoord = matrixMultiplier(matrix, [
				navPanelCoords!.xh,
				navPanelCoords!.yh,
				navPanelCoords!.zh,
				1,
			]);

			setNavPanelCoords(singleMriCoord);
		},
		[patientId]
	);

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
				getNavPanelCoords={getNavPanelCoords}
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
