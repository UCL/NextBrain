import "./Atlas.css";

const Atlas = () => {
	return (
		<main className="atlas-container">
			<section className="panels-container">
				<div className="side-panel-1">Sagittal panel</div>
				<div className="side-panel-2">Coronal panel</div>
				<div className="side-panel-3">Axial panel</div>
				<div className="main-panel">Histology panel</div>
				<div className="scrollbar"></div>
			</section>
			<section className="options-container">
				<div className="atlas-navigation">Atlas navigation</div>
				<div className="show-labels"> Show labels</div>
				<div className="label-transparency">Label transparency</div>
				<div className="channel">Channel</div>
				<div className="current-label"> Current label</div>
			</section>
		</main>
	);
};

export default Atlas;
