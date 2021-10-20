import { FC } from "react";

import HistologyScrollbar from "./HistologyScrollbar";
import { HistologyCoords } from "../../../models/histologyCoords.model";
import { AtlasImagesDimensionsKey } from "../../../models/atlasImagesDimensionsKey.model";

import "./Scrollbars.css";

interface Props {
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
	atlasImagesDimensionsKey: AtlasImagesDimensionsKey | null;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		showHiRes,
		setShowHiRes,
		atlasImagesDimensionsKey,
	} = props;

	return (
		<HistologyScrollbar
			histologyImageCoords={histologyImageCoords}
			adjustHistologyCoordsFromScrollbar={adjustHistologyCoordsFromScrollbar}
			showHiRes={showHiRes}
			setShowHiRes={setShowHiRes}
			atlasImagesDimensionsKey={atlasImagesDimensionsKey}
		/>
	);
};

export default Scrollbars;
