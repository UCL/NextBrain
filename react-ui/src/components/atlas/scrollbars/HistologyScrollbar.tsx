import { FC, useEffect, useState } from "react";

import histologySliceMap from "../../utils/histologySliceMap";
import getMouseCoords from "../../utils/getmouseCoords";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyScrollbar.css";

interface Props {
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
}

const HistologyScrollbar: FC<Props> = (props) => {
	const [scrollbarPos, setScrollbarPos] = useState(0);

	const { histologyImageCoords, adjustHistologyCoordsFromScrollbar } = props;

	useEffect(() => {
		// determine the scrollbar position for the current histology slice
		console.log(histologyImageCoords);

		const scrollbarLength = 824;
		const currentHistologySliceNumber = histologyImageCoords!.coords.slice;
		const currentBlock = histologyImageCoords!.currentBlock;
		const slicesInBlock = histologySliceMap[currentBlock]["slices"];
		const currentSliceAsProportion =
			currentHistologySliceNumber / slicesInBlock;

		const newHistologyScrollbarPos = +(
			scrollbarLength * currentSliceAsProportion
		).toFixed(0);

		console.log(newHistologyScrollbarPos);

		//const currentMriPlaneScrollbarPos = scrollbarPos[plane];
		setScrollbarPos(newHistologyScrollbarPos);
	}, [histologyImageCoords]);

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

		try {
			adjustHistologyCoordsFromScrollbar(newHistologySliceNumber);
			setScrollbarPos(mouseY);
		} catch {
			console.log("error found when adjusting histology scrollbar");
		}
	};

	return (
		<div
			className="histology-scrollbar-container"
			onClick={(e) => updateHistologyScrollbarPos(e)}
		>
			<svg
				className="histology-scrollbar-widget"
				style={{ top: `${scrollbarPos}px` }}
			></svg>
		</div>
	);
};

export default HistologyScrollbar;
