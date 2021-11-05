import { FC } from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

interface Props {
	onClick: () => void;
}

// is ! appropriate here?
const Backdrop: FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<div className="backdrop" onClick={props.onClick}></div>,
		document.getElementById("backdrop-hook")!
	);
};

export default Backdrop;
