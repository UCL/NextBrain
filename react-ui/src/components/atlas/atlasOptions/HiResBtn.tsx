import { FC } from "react";

interface Props {
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const HiResBtn: FC<Props> = (props) => {
	const { showHiRes, setShowHiRes } = props;

	return (
		<div className="hi-res" onClick={() => setShowHiRes(!showHiRes)}>
			<button>{showHiRes ? "Hide" : "Show"} hi-res histology</button>
		</div>
	);
};

export default HiResBtn;
