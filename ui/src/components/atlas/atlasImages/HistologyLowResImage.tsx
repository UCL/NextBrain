import { FC } from "react";

interface Props {
	histologyImage: any;
	updateHistologyCoordsHandler: any;
	onImageLoad: any;
}

const HistologyLowResImage: FC<Props> = (props) => {
	const { histologyImage, updateHistologyCoordsHandler, onImageLoad } = props;

	return (
		<img
			onClick={(e) => {
				updateHistologyCoordsHandler(e, "lowRes");
			}}
			className="histology-img"
			src={histologyImage}
			alt="histology"
			onLoad={(e) => onImageLoad(e, "onLoad")}
		></img>
	);
};

export default HistologyLowResImage;
