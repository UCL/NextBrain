import { FC } from "react";

import "./MousePointer.css";

interface Props {
	mouseY: number;
	mouseX: number;
}

const MousePointer: FC<Props> = (props) => {
	const { mouseY, mouseX } = props;

	// coordinates recieved by MousePointer are rounded in order to calcuate mri and histology, find a way around this?
	if (mouseX && mouseY) {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: mouseY,
					left: mouseX,
				}}
			></div>
		);
	}

	// shows default coords if none can be found
	// show an error instead?
	return (
		<div
			className="mouse-pointer"
			style={{
				top: 100,
				left: 100,
			}}
		></div>
	);
};

export default MousePointer;
