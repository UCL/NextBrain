import { FC, useState, useCallback } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";
import getMatrix from "../components/utils/getMatrix";
import matrixMultiplier from "../components/utils/matrixMultiplier";

import { CurrentLabel } from "../models/label.model";
import { Centroid } from "../models/centroid.model";

import "./Atlas.css";

const Atlas: FC = () => {
	const [patientId, setPatientId] = useState("BrainAtlas-P57-16/main/P57-16");
	const [channel, setChannel] = useState("LFB");
	const [showHiRes, setShowHiRes] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState("0.5");
	const [currentLabel, setCurrentLabel] = useState<CurrentLabel | null>(null);
	const [centroid, setCentroid] = useState<Centroid | null>(null);

	// useCallback prevents unnecessary re-render of child component (AtlasNavigation.tsx)
	const getCentroid = useCallback(
		async (navCoords: any) => {
			const matrix = await getMatrix(
				navCoords!.blockNumber,
				"histology",
				patientId
			);

			// why is the order of params here different compared to the function that handles physical clicks?
			// the x and y are swapped here compared to the histologyToMri function
			// there must be some sort of flipping of axes somewhere
			// regardless, the app seems to work with this configuration
			const coords = matrixMultiplier(matrix, [
				navCoords!.xh,
				navCoords!.yh,
				navCoords!.zh,
				1,
			]);

			setCentroid(coords);
		},
		[patientId]
	);

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
				centroid={centroid}
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
				getCentroid={getCentroid}
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
