import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");
	const [hiRes, setHiRes] = useState(false);
	const [labels, setLabels] = useState(false);

	return (
		<main className="atlas-container">
			<AtlasImages channel={channel} hiRes={hiRes} labels={labels} />
			<AtlasOptions
				channel={channel}
				setChannel={setChannel}
				hiRes={hiRes}
				setHiRes={setHiRes}
				labels={labels}
				setLabels={setLabels}
			/>
		</main>
	);
};

export default Atlas;
