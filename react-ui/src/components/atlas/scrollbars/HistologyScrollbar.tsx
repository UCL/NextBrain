import { FC } from "react";

import histologySliceMap from "../../utils/histologySliceMap";
import getMouseCoords from "../../utils/getmouseCoords";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyScrollbar.css";

interface Props {
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
	histologyImageCoords: HistologyCoords | null;
	adjustCoordsFromScrollbar: (newSliceNumber: number) => void;
}

const HistologyScrollbar: FC<Props> = (props) => {
	const {
		histologyScrollbarPos,
		setHistologyScrollbarPos,
		histologyImageCoords,
		adjustCoordsFromScrollbar,
	} = props;

	const updateHistologyScrollbarPos = (e: React.MouseEvent) => {
		const { mouseY } = getMouseCoords(e);

		const currentBlock = histologyImageCoords!.currentBlock;
		const slicesInBlock = histologySliceMap[currentBlock]["slices"];

		const scrollbarLength = 824;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		const newHistologySliceNumber = (mouseY / scrollbarLength) * slicesInBlock;

		console.log(mouseY);
		console.log(slicesInBlock);
		console.log(newHistologySliceNumber.toFixed(0));

		setHistologyScrollbarPos(mouseY);
		adjustCoordsFromScrollbar(newHistologySliceNumber);
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
