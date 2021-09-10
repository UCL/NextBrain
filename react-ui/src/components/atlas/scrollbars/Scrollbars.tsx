import { FC } from "react";

import MriScrollbar from "./MriScrollbar";
import HistologyScrollbar from "./HistologyScrollbar";

import { HistologyCoords } from "../../../models/histologyCoords.model";
import { ScrollbarPos } from "../../../models/scrollbarPos.model";
import { MriCoords } from "../../../models/mriCoords.model";

import "./Scrollbars.css";

interface Props {
	scrollbarPos: ScrollbarPos;
	setScrollbarPos: (newMriPos: ScrollbarPos) => void;
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	adjustMriCoordsFromScrollbar: (newSliceNumber: number, plane: string) => void;
	mriImageCoords: MriCoords | null;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		scrollbarPos,
		setScrollbarPos,
		histologyScrollbarPos,
		setHistologyScrollbarPos,
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		adjustMriCoordsFromScrollbar,
		mriImageCoords,
	} = props;

	// disable scrollbars while in hi-res mode?

	return (
		<>
			<MriScrollbar
				plane="sagittal"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
			/>

			<MriScrollbar
				plane="coronal"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
			/>

			<MriScrollbar
				plane="axial"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
			/>

			<HistologyScrollbar
				histologyScrollbarPos={histologyScrollbarPos}
				setHistologyScrollbarPos={setHistologyScrollbarPos}
				histologyImageCoords={histologyImageCoords}
				adjustHistologyCoordsFromScrollbar={adjustHistologyCoordsFromScrollbar}
			/>
		</>
	);
};

export default Scrollbars;
