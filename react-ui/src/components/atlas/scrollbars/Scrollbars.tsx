import { FC } from "react";

import MriScrollbar from "./MriScrollbar";
import HistologyScrollbar from "./HistologyScrollbar";

import { HistologyCoords } from "../../../models/histologyCoords.model";
import { MriCoords } from "../../../models/mriCoords.model";

import "./Scrollbars.css";

interface Props {
	histologyImageCoords: HistologyCoords | null;
	adjustHistologyCoordsFromScrollbar: (newSliceNumber: number) => void;
	adjustMriCoordsFromScrollbar: (newSliceNumber: number, plane: string) => void;
	mriImageCoords: MriCoords | null;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		histologyImageCoords,
		adjustHistologyCoordsFromScrollbar,
		adjustMriCoordsFromScrollbar,
		mriImageCoords,
		showHiRes,
		setShowHiRes,
	} = props;

	// disable scrollbars while in hi-res mode?
	// mri scrollbars have been disabled for now as they are not a priority
	// the mri scrollbars should apparently adjust x and y values, not slices (so 2 scrollbars for each mri plane)

	return (
		<>
			{/* <MriScrollbar
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
			/> */}

			<HistologyScrollbar
				histologyImageCoords={histologyImageCoords}
				adjustHistologyCoordsFromScrollbar={adjustHistologyCoordsFromScrollbar}
				showHiRes={showHiRes}
				setShowHiRes={setShowHiRes}
			/>
		</>
	);
};

export default Scrollbars;
