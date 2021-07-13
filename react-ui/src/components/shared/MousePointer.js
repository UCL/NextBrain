import "./MousePointer.css";

const MousePointer = (props) => {
	const { type, plane, imageCoords } = props;

	if (imageCoords === null || imageCoords === undefined) {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: 100,
					left: 100,
				}}
			></div>
		);
	}

	if (type === "mri") {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: +imageCoords[plane].mouseY,
					left: +imageCoords[plane].mouseX,
				}}
			></div>
		);
	}

	if (type === "histology") {
		return (
			<div
				className="mouse-pointer"
				style={{
					top: +imageCoords.coords.mouseY,
					left: +imageCoords.coords.mouseX,
				}}
			></div>
		);
	}
};

export default MousePointer;
