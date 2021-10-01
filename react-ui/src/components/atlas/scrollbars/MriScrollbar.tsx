import { FC, useState, useEffect } from "react";

import mriCoordinatesKey from "../../utils/mriCoordinatesKey";
import getMouseCoords from "../../utils/getmouseCoords";

import { MriCoords } from "../../../models/mriCoords.model";

import "./MriScrollbar.css";

interface Props {
	plane: string;
	adjustMriCoordsFromScrollbar: (newSliceNumber: number, plane: string) => void;
	mriImageCoords: MriCoords | null;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const MriScrollbar: FC<Props> = (props) => {
	const [currentScrollbarPos, setCurrentScrollbarPos] = useState(0);

	const {
		plane,
		adjustMriCoordsFromScrollbar,
		mriImageCoords,
		showHiRes,
		setShowHiRes,
	} = props;

	useEffect(() => {
		// determine the scrollbar position for the current mri plane
		console.log(mriImageCoords);

		const scrollbarLength = 272;
		const currentMriSliceNumber = mriImageCoords![plane]["slice"];
		const slicesInPlane = +mriCoordinatesKey[plane]["slices"];
		const currentSliceAsProportion = currentMriSliceNumber / slicesInPlane;

		const newMriScrollbarPos = +(
			scrollbarLength * currentSliceAsProportion
		).toFixed(0);

		console.log(newMriScrollbarPos);

		//const currentMriPlaneScrollbarPos = scrollbarPos[plane];
		setCurrentScrollbarPos(newMriScrollbarPos);
	}, [plane, mriImageCoords]);

	const updateScrollbarPos = (e: React.MouseEvent) => {
		const { mouseY } = getMouseCoords(e, showHiRes);

		const scrollbarLength = 272;

		const slicesInPlane = +mriCoordinatesKey[plane]["slices"];
		//const newScrollValue = mouseY / slicesInPlane;

		// method for positioning the scrollbar based on the max number of slices in the mri plane
		const newMriSliceNumber = (mouseY / scrollbarLength) * slicesInPlane;

		console.log(mouseY);
		console.log(slicesInPlane);
		console.log(newMriSliceNumber.toFixed(0));

		try {
			adjustMriCoordsFromScrollbar(newMriSliceNumber, plane);

			// you could also set it this way (but the method in useEffect is more robust)
			// setCurrentScrollbarPos(mouseY);
		} catch {
			console.log("error found when adjusting histology scrollbar");
		}
	};

	return (
		<div
			className={`scrollbar mri-scrollbar-container`}
			onClick={(e) => updateScrollbarPos(e)}
		>
			<svg
				className={`mri-scrollbar-widget mri-${plane}-scrollbar-widget`}
				style={{ top: `${currentScrollbarPos}px` }}
			></svg>
		</div>
	);
};

export default MriScrollbar;
