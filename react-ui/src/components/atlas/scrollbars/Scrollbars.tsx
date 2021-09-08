import { FC } from "react";

import MriScrollbar from "./MriScrollbar";

import "./Scrollbars.css";
import HistologyScrollbar from "./HistologyScrollbar";

interface Props {
	scrollbarPos: number;
	setScrollbarPos: (mouseY: number) => void;
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const {
		scrollbarPos,
		setScrollbarPos,
		histologyScrollbarPos,
		setHistologyScrollbarPos,
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
			/>
		</>
	);
};

export default Scrollbars;
