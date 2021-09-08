import { FC } from "react";

import MriScrollbar from "./MriScrollbar";

import "./Scrollbars.css";
//import HistologyScrollbar from "./HistologyScrollbar";

interface Props {
	scrollbarPos: number;
	setScrollbarPos: (mouseY: number) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const { scrollbarPos, setScrollbarPos } = props;

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
		</>
	);
};

export default Scrollbars;
