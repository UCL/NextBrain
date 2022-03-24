import { FC } from "react";

import "./MousePointer.css";

interface Props {
	mouseY: number;
	mouseX: number;
	showHiRes?: boolean;
}

const MousePointer: FC<Props> = (props) => {
	const { mouseY, mouseX, showHiRes } = props;

	if (mouseX != null && mouseY != null) {
		return (
			<div
				className={`mouse-pointer ${showHiRes && "mouse-hi-res"}`}
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
