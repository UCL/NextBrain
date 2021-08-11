import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");
	const [hiRes, setHiRes] = useState(false);
	const [labels, setLabels] = useState(false);
	const [labelsTransparency, setLabelsTransparency] = useState(0.5);

	console.log(labelsTransparency);

	return (
		<main className="atlas-container">
			<AtlasImages
				channel={channel}
				hiRes={hiRes}
				labels={labels}
				labelsTransparency={labelsTransparency}
			/>
			<AtlasOptions
				channel={channel}
				setChannel={setChannel}
				hiRes={hiRes}
				setHiRes={setHiRes}
				labels={labels}
				setLabels={setLabels}
				labelsTransparency={labelsTransparency}
				setLabelsTransparency={setLabelsTransparency}
			/>
		</main>
	);
};

export default Atlas;
