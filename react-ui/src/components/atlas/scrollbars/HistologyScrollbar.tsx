import { FC } from "react";

import getMouseCoords from "../../utils/getmouseCoords";

import "./HistologyScrollbar.css";

interface Props {
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
}

const HistologyScrollbar: FC<Props> = (props) => {
	const { histologyScrollbarPos, setHistologyScrollbarPos } = props;

	const updateHistologyScrollbarPos = (e: React.MouseEvent) => {
		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);

		const maxHistologyScrollValue = 824;
		const newScrollValue = mouseY / maxHistologyScrollValue;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		// const histologySliceNumber = (mouseY / maxHistologyScrollValue) * maxHistologySliceNumber;

		console.log(newScrollValue);

		setHistologyScrollbarPos(mouseY);
	};

	return (
		<div
			className="histology-scrollbar-container"
			onClick={(e) => updateHistologyScrollbarPos(e)}
		>
			<svg
				className="histology-scrollbar-widget"
				style={{ top: `${histologyScrollbarPos}px` }}
			></svg>
		</div>
	);
};

export default HistologyScrollbar;
