import { FC } from "react";

import "./LoadingSpinner.css";

interface Props {
	asOverlay: boolean;
}

const LoadingSpinner: FC<Props> = (props) => {
	return (
		<div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
			<div className="lds-dual-ring"></div>
		</div>
	);
};

export default LoadingSpinner;
