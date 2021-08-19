import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";
import histologyLabelParser from "../components/utils/histologyLabelParser";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");
	const [showHiRes, setShowHiRes] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState(0.5);
	const [currentLabel, setCurrentLabel] = useState(null);

	const getCurrentLabel = async (e, histologyImageCoords, type) => {
		console.log("getting current histology label");
		console.log(histologyImageCoords);
		console.log(e);

		const currentLabel = await histologyLabelParser(
			e,
			histologyImageCoords,
			type
		);
		console.log(currentLabel);

		setCurrentLabel(currentLabel);
	};

	return (
		<main className="atlas-container">
			<AtlasImages
				channel={channel}
				showHiRes={showHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				getCurrentLabel={getCurrentLabel}
			/>
			<AtlasOptions
				channel={channel}
				setChannel={setChannel}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
				showLabels={showLabels}
				setShowLabels={setShowLabels}
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
				currentLabel={currentLabel}
			/>
		</main>
	);
};

export default Atlas;
