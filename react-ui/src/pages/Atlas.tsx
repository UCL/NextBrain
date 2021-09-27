import { FC, useState, useCallback } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";
import { CurrentLabel } from "../models/label.model";
import { ScrollbarPos } from "../models/scrollbarPos.model";
import getMatrix from "../components/utils/getMatrix";
import matrixMultiplier from "../components/utils/matrixMultiplier";

import "./Atlas.css";

const Atlas: FC = () => {
	const [patientId, setPatientId] = useState("P57-16_updated");
	const [channel, setChannel] = useState("LFB");
	const [showHiRes, setShowHiRes] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState("0.5");
	const [currentLabel, setCurrentLabel] = useState<CurrentLabel>([]);
	const [histologyScrollbarPos, setHistologyScrollbarPos] = useState(0);
	const [centroid, setCentroid] = useState<any>();

	// useCallback prevents unnecessary re-render of child component (AtlasNavigation.tsx)
	const getCentroid = useCallback(
		async (navCoords: any) => {
			const matrix = await getMatrix(
				navCoords!.blockNumber,
				"histology",
				patientId
			);

			console.log("matrix: " + matrix);

			const coords = matrixMultiplier(matrix, [
				navCoords!.xh,
				navCoords!.yh,
				navCoords!.zh,
				1,
			]);

			console.log(coords);

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
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setCurrentLabel={setCurrentLabel}
				histologyScrollbarPos={histologyScrollbarPos}
				setHistologyScrollbarPos={setHistologyScrollbarPos}
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
