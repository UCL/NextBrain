import { FC } from "react";

import HistologyScrollbar from "./HistologyScrollbar";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./Scrollbars.css";

interface Props {
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		showHiRes,
		setShowHiRes,
	} = props;

	return (
		<HistologyScrollbar
			histologyImageCoords={histologyImageCoords}
			adjustHistologyCoordsFromScrollbar={adjustHistologyCoordsFromScrollbar}
			showHiRes={showHiRes}
			setShowHiRes={setShowHiRes}
		/>
	);
};

export default Scrollbars;
