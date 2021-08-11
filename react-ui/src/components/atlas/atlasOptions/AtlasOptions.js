import ImageChannels from "./ImageChannels";

import "./AtlasOptions.css";

const AtlasOptions = (props) => {
	const { channel, setChannel, hiRes, setHiRes, labels, setLabels } = props;

	return (
		<section className="options-container">
			<div className="scrollbar"></div>

			<div className="atlas-navigation">Atlas navigation</div>

			<div className="show-labels" onClick={() => setLabels(!labels)}>
				<button>{labels ? "Hide" : "Show"} labels</button>
			</div>

			<div className="label-transparency">Label transparency</div>

			<ImageChannels channel={channel} setChannel={setChannel} />

			<div className="current-label"> Current label</div>

			<div className="hi-res" onClick={() => setHiRes(!hiRes)}>
				<button>{hiRes ? "Hide" : "Show"} hi-res histology</button>
			</div>
		</section>
	);
};

export default AtlasOptions;
