import AtlasImages from "../components/atlas/atlasImages/AtlasImages";
import AtlasOptions from "../components/atlas/atlasOptions/AtlasOptions";

import "./Atlas.css";

const Atlas = () => {
	return (
		<>
			<main className="atlas-container">
				<AtlasImages />
				<AtlasOptions />
			</main>
		</>
	);
};

export default Atlas;
