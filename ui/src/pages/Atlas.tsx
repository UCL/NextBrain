import { FC, useState, useCallback, useEffect } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
//import Scrollbars from "../components/atlas/scrollbars/Scrollbars";
import getMatrix from "../components/utils/getMatrix";
import matrixMultiplier from "../components/utils/matrixMultiplier";
import { ASSETS_URL } from "../components/utils/ASSETS_URL";

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
	const [atlasImagesDimensionsKey, setAtlasImagesDimensionsKey] =
		useState<any>(null);

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

			console.log(mriDimensionsKeyFile);
			console.log(histologyLowResDimensionsKeyFile);
			console.log(histologyHiResDimensionsKeyFile);

			const atlasImagesDimensionsKey = {
				mriDimensions: mriDimensionsKeyFile,
				histologyLowResDimensions: histologyLowResDimensionsKeyFile,
				histologyHiResDimensions: histologyHiResDimensionsKeyFile,
			};

			setAtlasImagesDimensionsKey(atlasImagesDimensionsKey);
		};

		getAtlasImageDimensionsFiles();
	}, [patientId]);

	if (atlasImagesDimensionsKey == null) {
		return (
			<div>
				Trying to load in atlas image dimensions keys, this should only take a
				few seconds.
			</div>
		);
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
				centroid={centroid}
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
