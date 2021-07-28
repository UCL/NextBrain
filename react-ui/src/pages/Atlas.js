import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");
	const [hiRes, setHiRes] = useState(false);

	return (
		<main className="atlas-container">
			<AtlasImages channel={channel} hiRes={hiRes} />
			<AtlasOptions
				channel={channel}
				setChannel={setChannel}
				hiRes={hiRes}
				setHiRes={setHiRes}
			/>
		</main>
	);
};

export default Atlas;
