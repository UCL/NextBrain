import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");
	const [showHiRes, setShowHiRes] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState(0.5);
	const [currentLabel, setCurrentLabel] = useState(null);

	return (
		<main className="atlas-container">
			<AtlasImages
				channel={channel}
				showHiRes={showHiRes}
				showLabels={showLabels}
				labelsTransparency={labelsTransparency}
				setCurrentLabel={setCurrentLabel}
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
