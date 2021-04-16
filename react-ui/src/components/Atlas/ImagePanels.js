import "./ImagePanels.css";

const ImagePanels = () => {
	return (
		<section className="panels-container">
			<div className="side-panel-1">Sagittal panel</div>
			<div className="side-panel-2">Coronal panel</div>
			<div className="side-panel-3">Axial panel</div>
			<div className="main-panel">Histology panel</div>
			<div className="scrollbar"></div>
		</section>
	);
};

export default ImagePanels;
