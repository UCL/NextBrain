import { FC, useEffect, useState, useRef } from "react";

import ErrorModal from "../../shared/ErrorModal";
import getMouseCoords from "../../utils/getMouseCoords";

import { HistologyCoords } from "../../../models/histologyCoords.model";
import { AtlasImagesDimensionsKey } from "../../../models/atlasImagesDimensionsKey.model";

import "./HistologyScrollbar.css";

interface Props {
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null;
}

const HistologyScrollbar: FC<Props> = (props) => {
	const scrollbarRef: any = useRef();

	const [error, setError] = useState<string | null>(null);
	const [scrollbarPos, setScrollbarPos] = useState(0);

	const {
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		showHiRes,
		setShowHiRes,
		atlasImagesDimensionsKey,
	} = props;

	const currentBlock = histologyImageCoords!.currentHistologyBlock;

	const currentHistologySliceNumber =
		histologyImageCoords!.currentHistologySlice;

	const slicesInBlock =
		+atlasImagesDimensionsKey!.histologyLowResDimensions[currentBlock][
			"slices"
		] - 1; // -1 because slices start at 0

	// determine the scrollbar position for the current histology slice
	useEffect(() => {
		const scrollbarLength = scrollbarRef.current.clientHeight;

		const currentSliceAsProportion =
			currentHistologySliceNumber / slicesInBlock;

		const newHistologyScrollbarPos = +(
			scrollbarLength * currentSliceAsProportion
		).toFixed(0);

		setScrollbarPos(newHistologyScrollbarPos);
	}, [
		histologyImageCoords,
		atlasImagesDimensionsKey,
		currentHistologySliceNumber,
		slicesInBlock,
	]);

	const updateHistologyScrollbarPos = (e: React.MouseEvent) => {
		setShowHiRes(false);

		const { mouseY } = getMouseCoords(e, showHiRes);

		const scrollbarLength = scrollbarRef.current.clientHeight;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		const newHistologySliceNumber = (mouseY / scrollbarLength) * slicesInBlock;

		const scrollbarIsWithinBounds = checkScrollbarBoundaries(
			newHistologySliceNumber
		);

		if (!scrollbarIsWithinBounds) {
			console.log("cannot increment histology slice");
			return;
		}

		try {
			adjustHistologyCoordsFromScrollbar(newHistologySliceNumber);
		} catch {
			console.log("error found when adjusting histology scrollbar");
		}
	};

	const incrementHistologyScrollbarPos = (increment: number) => {
		setShowHiRes(false);

		const newHistologySliceNumber = currentHistologySliceNumber + increment;

		const scrollbarIsWithinBounds = checkScrollbarBoundaries(
			newHistologySliceNumber
		);

		if (!scrollbarIsWithinBounds) {
			console.log("cannot increment histology slice");
			return;
		}

		adjustHistologyCoordsFromScrollbar(newHistologySliceNumber);
	};

	const checkScrollbarBoundaries = (newHistologySliceNumber: number) => {
		if (
			newHistologySliceNumber < 0 ||
			newHistologySliceNumber > slicesInBlock
		) {
			return false;
		}

		return true;
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
					ref={scrollbarRef}
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
