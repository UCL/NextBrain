import { FC } from "react";

import MriScrollbar from "./MriScrollbar";
import HistologyScrollbar from "./HistologyScrollbar";
import { HistologyCoords } from "../../../models/histologyCoords.model";

import "./Scrollbars.css";

interface Props {
	scrollbarPos: number;
	setScrollbarPos: (mouseY: number) => void;
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
	histologyImageCoords: HistologyCoords | null;
	adjustCoordsFromScrollbar: (newSliceNumber: number) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		scrollbarPos,
		setScrollbarPos,
		histologyScrollbarPos,
		setHistologyScrollbarPos,
		histologyImageCoords,
		adjustCoordsFromScrollbar,
	} = props;

	return (
		<>
			<MriScrollbar
				plane="sagittal"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
			/>

			<MriScrollbar
				plane="coronal"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
			/>

			<MriScrollbar
				plane="axial"
				scrollbarPos={scrollbarPos}
				setScrollbarPos={setScrollbarPos}
			/>

			<HistologyScrollbar
				histologyScrollbarPos={histologyScrollbarPos}
				setHistologyScrollbarPos={setHistologyScrollbarPos}
				histologyImageCoords={histologyImageCoords}
				adjustCoordsFromScrollbar={adjustCoordsFromScrollbar}
			/>
		</>
	);
};

export default Scrollbars;
