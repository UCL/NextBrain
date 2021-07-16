import React, { useState } from "react";

import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	const [channel, setChannel] = useState("LFB");

	return (
		<main className="atlas-container">
			<AtlasImages channel={channel} />
			<AtlasOptions channel={channel} setChannel={setChannel} />
		</main>
	);
};

export default Atlas;
