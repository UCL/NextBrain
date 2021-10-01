import { FC, useEffect, useState } from "react";

import ErrorModal from "../../shared/ErrorModal";
import histologySliceMap from "../../utils/histologySliceMap";
import getMouseCoords from "../../utils/getmouseCoords";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./HistologyScrollbar.css";

interface Props {
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const HistologyScrollbar: FC<Props> = (props) => {
	const [error, setError] = useState<string | null>(null);
	const [scrollbarPos, setScrollbarPos] = useState(0);

	const {
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		showHiRes,
		setShowHiRes,
	} = props;

	useEffect(() => {
		// determine the scrollbar position for the current histology slice

		const scrollbarLength = 824;
		const currentHistologySliceNumber = histologyImageCoords!.coords.slice;
		const currentBlock = histologyImageCoords!.currentBlock;
		const slicesInBlock = histologySliceMap[currentBlock]["slices"] - 1; // -1 because slices start at 0
		const currentSliceAsProportion =
			currentHistologySliceNumber / slicesInBlock;

		const newHistologyScrollbarPos = +(
			scrollbarLength * currentSliceAsProportion
		).toFixed(0);

		setScrollbarPos(newHistologyScrollbarPos);
	}, [histologyImageCoords]);

	const updateHistologyScrollbarPos = (e: React.MouseEvent) => {
		// if (showHiRes) {
		// 	setError("Navigation is disabled while in hi-res mode");
		// 	return;
		// }

		setShowHiRes(false);

		const { mouseY } = getMouseCoords(e, showHiRes);

		const currentBlock = histologyImageCoords!.currentBlock;
		const slicesInBlock = histologySliceMap[currentBlock]["slices"];

		// look into improving this, is it necessary to hard code this value? Same for the mri scrollbars
		const scrollbarLength = 824;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		// -1 to account for the fact that slices start at 0
		const newHistologySliceNumber =
			(mouseY / scrollbarLength) * slicesInBlock - 1;

		try {
			adjustHistologyCoordsFromScrollbar(newHistologySliceNumber);
		} catch {
			console.log("error found when adjusting histology scrollbar");
		}
	};

	const incrementHistologyScrollbarPos = (increment: number) => {
		// if (showHiRes) {
		// 	setError("Navigation is disabled while in hi-res mode");
		// 	return;
		// }

		setShowHiRes(false);

		const currentBlock = histologyImageCoords!.currentBlock;
		const slicesInBlock = histologySliceMap[currentBlock]["slices"] - 1;

		const currentHistologySliceNumber = histologyImageCoords!.coords.slice;
		const newHistologySliceNumber = currentHistologySliceNumber + increment;

		if (
			newHistologySliceNumber < 0 ||
			newHistologySliceNumber > slicesInBlock
		) {
			console.log("cannot increment histology slice");
			return;
		}

		adjustHistologyCoordsFromScrollbar(newHistologySliceNumber);
	};

	return (
		<>
			<ErrorModal error={error} onClear={() => setError(null)} />
			<div className="histology-scrollbar-container">
				<div
					className="histology-scrollbar-increment-btn up"
					onClick={() => incrementHistologyScrollbarPos(-1)}
				></div>
				<div
					className="scrollbar histology-scrollbar"
					onClick={(e) => updateHistologyScrollbarPos(e)}
				>
					<svg
						className="histology-scrollbar-widget"
						style={{ top: `${scrollbarPos}px` }}
					></svg>
				</div>
				<div
					className="histology-scrollbar-increment-btn down"
					onClick={() => incrementHistologyScrollbarPos(1)}
				></div>
			</div>
		</>
	);
};

export default HistologyScrollbar;
