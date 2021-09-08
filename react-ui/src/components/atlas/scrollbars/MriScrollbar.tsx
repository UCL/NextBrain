import { FC } from "react";

import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import getMouseCoords from "../../utils/getmouseCoords";

import "./MriScrollbar.css";

interface Props {
	plane: string;
	scrollbarPos: number;
	setScrollbarPos: (mouseY: number) => void;
}

const MriScrollbar: FC<Props> = (props) => {
	const { plane, scrollbarPos, setScrollbarPos } = props;

	const updateScrollbarPos = (e: React.MouseEvent) => {
		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);

		const maxScrollValue = +mriCoordinatesKey[plane]["slices"];
		const newScrollValue = mouseY / maxScrollValue;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		// const histologySliceNumber = (mouseY / maxHistologyScrollValue) * maxHistologySliceNumber;

		console.log(newScrollValue);

		setScrollbarPos(mouseY);
	};

	return (
		<div
			className={`mri-scrollbar-container`}
			onClick={(e) => updateScrollbarPos(e)}
		>
			<svg
				className={`mri-scrollbar-widget mri-${plane}-scrollbar-widget`}
				style={{ top: `${scrollbarPos}px` }}
			></svg>
		</div>
	);
};

export default MriScrollbar;
