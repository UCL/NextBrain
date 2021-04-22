import "./OptionsPanels.css";

const OptionsPanels = () => {
	return (
		<section className="options-container">
			<div className="atlas-navigation">Atlas navigation</div>
			<div className="show-labels"> Show labels</div>
			<div className="label-transparency">Label transparency</div>
			<div className="channel">Channel</div>
			<div className="current-label"> Current label</div>
		</section>
	);
};

export default OptionsPanels;
