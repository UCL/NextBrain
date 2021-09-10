import { FC, useState, useEffect } from "react";

import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import getMouseCoords from "../../utils/getmouseCoords";

import { ScrollbarPos } from "../../../models/scrollbarPos.model";

import "./MriScrollbar.css";

interface Props {
	plane: string;
	scrollbarPos: ScrollbarPos;
	setScrollbarPos: (newMriPos: ScrollbarPos) => void;
}

const MriScrollbar: FC<Props> = (props) => {
	const [currentScrollbarPos, setCurrentScrollbarPos] = useState(70);

	const { plane, scrollbarPos, setScrollbarPos } = props;

	useEffect(() => {
		// determine the scrollbar position for the current mri plane

		const currentMriPlaneScrollbarPos = scrollbarPos[plane];

		setCurrentScrollbarPos(currentMriPlaneScrollbarPos);
	}, [plane, scrollbarPos]);

	const updateScrollbarPos = (e: React.MouseEvent) => {
		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);

		const maxScrollValue = +mriCoordinatesKey[plane]["slices"];
		const newScrollValue = mouseY / maxScrollValue;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		// const histologySliceNumber = (mouseY / maxHistologyScrollValue) * maxHistologySliceNumber;

		console.log(newScrollValue);

		setScrollbarPos({ sagittal: 100, coronal: 10, axial: 200 });
	};

	return (
		<div
			className={`mri-scrollbar-container`}
			onClick={(e) => updateScrollbarPos(e)}
		>
			<svg
				className={`mri-scrollbar-widget mri-${plane}-scrollbar-widget`}
				style={{ top: `${currentScrollbarPos}px` }}
			></svg>
		</div>
	);
};

export default MriScrollbar;
