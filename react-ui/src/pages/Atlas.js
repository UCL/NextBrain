import "./Atlas.css";

const Atlas = () => {
	return (
		<main className="atlas-container">
			<section className="panels-container">
				<div className="side-panel-1"></div>
				<div className="side-panel-2"></div>
				<div className="side-panel-3"></div>
				<div className="main-panel"></div>
				<div className="scrollbar"></div>
			</section>
			<section className="options-container">
				<div className="atlas-navigation"></div>
				<div className="show-labels"></div>
				<div className="label-transparency"></div>
				<div className="chennel"></div>
				<div className="current-label"></div>
			</section>
		</main>
	);
};

export default Atlas;
