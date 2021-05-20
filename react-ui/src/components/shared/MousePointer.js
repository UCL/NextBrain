import "./MousePointer.css";

const MousePointer = (props) => {
	const { type, plane, mriImageCoords } = props;

	if (type === "mri") {
		return (
			<div
				className="mouse-pointer"
				// - 5 to account for element width and border offsets
				style={{
					top: +mriImageCoords[plane].mouseY - 5,
					left: +mriImageCoords[plane].mouseX - 5,
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
					top: 100,
					left: 100,
				}}
			></div>
		);
	}
};

export default MousePointer;
