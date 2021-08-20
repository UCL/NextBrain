const TransparencySlider = (props) => {
	const { showLabels, labelsTransparency, setLabelsTransparency } = props;

	return (
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
			disabled={showLabels ? false : true}
		/>
	);
};

export default TransparencySlider;
