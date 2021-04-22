import SagittalPanel from "./SagittalPanel";
import CoronalPanel from "./CoronalPanel";
import AxialPanel from "./AxialPanel";

import "./ImagePanels.css";

//const images = require.context("../../../assets/mri", true);

const ImagePanels = () => {
	return (
		<section className="panels-container">
			<SagittalPanel />
			<CoronalPanel />
			<AxialPanel />
			<div className="main-panel histology">Histology panel</div>
			<div className="scrollbar"></div>
		</section>
	);
};

export default ImagePanels;
