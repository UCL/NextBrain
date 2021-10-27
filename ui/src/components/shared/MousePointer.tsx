import { FC } from "react";

import "./MousePointer.css";

interface Props {
	mouseY: number;
	mouseX: number;
}

const MousePointer: FC<Props> = (props) => {
	const { mouseY, mouseX } = props;

	console.log(mouseX, mouseY);

	// coordinates recieved by MousePointer are rounded in order to calcuate mri and histology, find a way around this?
	if (mouseX != null && mouseY != null) {
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

	return (
		<div
			style={{
				position: "relative",
				top: 50,
				left: 50,
				zIndex: 1,
			}}
		>
			error: no mouse coords found
		</div>
	);
};

export default MousePointer;
