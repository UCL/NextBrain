import { FC } from "react";

interface Props {
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	channel: string;
}

const HiResBtn: FC<Props> = (props) => {
	const { showHiRes, setShowHiRes, channel } = props;

	return (
		<div className="hi-res" onClick={() => setShowHiRes(!showHiRes)}>
			<button disabled={channel === "MRI"}>
				{showHiRes ? "Hide" : "Show"} hi-res histology
			</button>
		</div>
	);
};

export default HiResBtn;
