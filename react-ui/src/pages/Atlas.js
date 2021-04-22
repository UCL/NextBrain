import ImagePanels from "../components/atlas/imagePanels/ImagePanels";
import OptionsPanels from "../components/atlas/optionsPanels/OptionsPanels";

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
