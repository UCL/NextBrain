import { FC } from "react";

import getMouseCoords from "../../utils/getmouseCoords";

import "./Scrollbars.css";

interface Props {
	histologyScrollbarPos: number;
	setHistologyScrollbarPos: (mouseY: number) => void;
}

const Scrollbars: FC<Props> = (props) => {
	const { histologyScrollbarPos, setHistologyScrollbarPos } = props;

	const updateHistologyScrollbarPos = (e: React.MouseEvent) => {
		const { mouseX, mouseY } = getMouseCoords(e);

		console.log(mouseX, mouseY);

		const maxHistologyScrollValue = 824;
		const newScrollValue = mouseY / maxHistologyScrollValue;

		// method for positioning the scrollbar based on the max number of slices in a histology block
		// const histologySliceNumber = (mouseY / maxHistologyScrollValue) * maxHistologySliceNumber;

		console.log(newScrollValue);

		setHistologyScrollbarPos(mouseY);
	};

	return (
		<>
			<div
				className="mri-scrollbar mri-sagittal-scrollbar"
				onClick={(e) => updateHistologyScrollbarPos(e)}
			>
				<svg
					className="mri-scrollbar-widget mri-sagittal-scrollbar-widget"
					style={{ top: `${histologyScrollbarPos}px` }}
				></svg>
			</div>

			<div
				className="mri-scrollbar mri-coronal-scrollbar"
				onClick={(e) => updateHistologyScrollbarPos(e)}
			>
				<svg
					className="mri-scrollbar-widget mri-coronal-scrollbar-widget"
					style={{ top: `${histologyScrollbarPos}px` }}
				></svg>
			</div>

			<div
				className="mri-scrollbar mri-axial-scrollbar"
				onClick={(e) => updateHistologyScrollbarPos(e)}
			>
				<svg
					className="mri-scrollbar-widget mri-axial-scrollbar-widget"
					style={{ top: `${histologyScrollbarPos}px` }}
				></svg>
			</div>
		</>
	);
};

export default Scrollbars;
