import { FC, SyntheticEvent } from "react";

interface Props {
	histologyImage: string;
	updateHistologyCoordsHandler: (e: SyntheticEvent | Event) => void;
	onImageLoad: (e: SyntheticEvent) => void;
}

const HistologyLowResImage: FC<Props> = (props) => {
	const { histologyImage, updateHistologyCoordsHandler, onImageLoad } = props;

	return (
		<img
			onClick={(e) => {
				updateHistologyCoordsHandler(e);
			}}
			className="histology-img"
			src={histologyImage}
			alt="histology"
			onLoad={(e) => onImageLoad(e)}
		></img>
	);
};

export default HistologyLowResImage;
