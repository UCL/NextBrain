import { FC } from "react";

import "./HiResBtn.css";

interface Props {
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const HiResBtn: FC<Props> = (props) => {
	const { showHiRes, setShowHiRes } = props;

	return (
		<div className="hi-res-btn-container">
			<button className="hi-res btn" onClick={() => setShowHiRes(!showHiRes)}>
				{showHiRes ? "Hide" : "Show"} hi-res histology
			</button>
		</div>
	);
};

export default HiResBtn;
