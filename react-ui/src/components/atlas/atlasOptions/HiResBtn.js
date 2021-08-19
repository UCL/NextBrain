const HiResBtn = (props) => {
	const { showHiRes, setShowHiRes } = props;

	return (
		<div className="hi-res" onClick={() => setShowHiRes(!showHiRes)}>
			<button>{showHiRes ? "Hide" : "Show"} hi-res histology</button>
		</div>
	);
};

export default HiResBtn;
