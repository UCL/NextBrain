import { FC, useState } from "react";

import ErrorModal from "../../shared/ErrorModal";

import "./HiResBtn.css";

interface Props {
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const HiResBtn: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);

	const { showHiRes, setShowHiRes } = props;

	return (
		<>
			<ErrorModal error={error} onClear={() => setError(null)} />
			<div className="hi-res-btn-container">
				<button className="hi-res btn" onClick={() => setShowHiRes(!showHiRes)}>
					{showHiRes ? "Hide" : "Show"} hi-res histology
				</button>
			</div>
		</>
	);
};

export default HiResBtn;
