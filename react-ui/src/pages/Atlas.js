import ImagePanels from "../components/Atlas/ImagePanels";
import OptionsPanels from "../components/Atlas/OptionsPanels";

import "./Atlas.css";

const Atlas = () => {
	return (
		<main className="atlas-container">
			<ImagePanels />
			<OptionsPanels />
		</main>
	);
};

export default Atlas;
