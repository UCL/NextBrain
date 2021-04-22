import ImagePanels from "../components/atlas/ImagePanels";
import OptionsPanels from "../components/atlas/OptionsPanels";

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
