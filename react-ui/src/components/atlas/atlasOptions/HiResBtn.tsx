import { FC } from "react";

import "./HiResBtn.css";

interface Props {
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	channel: string;
}

const HiResBtn: FC<Props> = (props) => {
	const { showHiRes, setShowHiRes, channel } = props;

	return (
		<button
			className="hi-res btn"
			onClick={() => setShowHiRes(!showHiRes)}
			disabled={channel === "MRI"}
		>
			{showHiRes ? "Hide" : "Show"} hi-res histology
		</button>
	);
};

export default HiResBtn;
