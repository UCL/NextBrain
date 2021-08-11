import ImageChannels from "./ImageChannels";

import "./AtlasOptions.css";

const AtlasOptions = (props) => {
	const {
		channel,
		setChannel,
		hiRes,
		setHiRes,
		labels,
		setLabels,
		labelsTransparency,
		setLabelsTransparency,
	} = props;

	return (
		<section className="options-container">
			<div className="scrollbar"></div>

			<div className="atlas-navigation">Atlas navigation</div>

			<div className="show-labels" onClick={() => setLabels(!labels)}>
				<button>{labels ? "Hide" : "Show"} labels</button>
			</div>

			<input
				type="range"
				name="labels-transparency"
				id="labels-transparency"
				className="labels-transparency-slider"
				value={labelsTransparency}
				onChange={(e) => {
					setLabelsTransparency(e.target.value);
				}}
				min="0"
				max="1"
				step="0.01"
			/>

			<ImageChannels channel={channel} setChannel={setChannel} />

			<div className="current-label"> Current label</div>

			<div className="hi-res" onClick={() => setHiRes(!hiRes)}>
				<button>{hiRes ? "Hide" : "Show"} hi-res histology</button>
			</div>
		</section>
	);
};

export default AtlasOptions;
