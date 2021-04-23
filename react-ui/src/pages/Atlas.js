import React from "react";

import ImagePanels from "../components/Atlas/imagePanels/ImagePanels";
import OptionsPanels from "../components/Atlas/optionsPanels/OptionsPanels";

import "./Atlas.css";

const Atlas = () => {
	return (
		<>
			<main className="atlas-container">
				<ImagePanels />
				<OptionsPanels />
			</main>
		</>
	);
};

export default Atlas;
