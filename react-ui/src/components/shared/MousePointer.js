import "./MousePointer.css";

const MousePointer = (props) => {
	const { type, plane, imageCoords } = props;

	console.log(imageCoords);

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
				// - 5 to account for element width and border offsets
				style={{
					top: +imageCoords[plane].mouseY - 5,
					left: +imageCoords[plane].mouseX - 5,
				}}
			></div>
		);
	}

	if (type === "histology") {
		return (
			<div
				className="mouse-pointer"
				// - 5 to account for element width and border offsets
				style={{
					top: +imageCoords.coords[0],
					left: +imageCoords.coords[1],
				}}
			></div>
		);
	}
};

export default MousePointer;
