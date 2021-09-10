import { FC } from "react";

import MriScrollbar from "./MriScrollbar";
import HistologyScrollbar from "./HistologyScrollbar";

import { HistologyCoords } from "../../../models/histologyCoords.model";
import { MriCoords } from "../../../models/mriCoords.model";

import "./Scrollbars.css";

interface Props {
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	adjustMriCoordsFromScrollbar: (newSliceNumber: number, plane: string) => void;
	mriImageCoords: MriCoords | null;
}

const Scrollbars: FC<Props> = (props) => {
	const {
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
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
			/>

			<MriScrollbar
				plane="coronal"
				adjustMriCoordsFromScrollbar={adjustMriCoordsFromScrollbar}
				mriImageCoords={mriImageCoords}
			/>

			<MriScrollbar
				plane="axial"
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
