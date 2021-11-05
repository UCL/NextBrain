import { FC } from "react";

interface Props {
	labelsImage: string;
	labelsTransparency: string;
}

const HistologyLabelsImage: FC<Props> = (props) => {
	const { labelsImage, labelsTransparency } = props;

	return (
		<img
			className="histology-img-labels"
			src={labelsImage}
			alt="histology-labels"
			//onLoad={(e) => onImageLoad(e, "lowRes")}
			style={{ opacity: `${labelsTransparency}` }}
		></img>
	);
};

export default HistologyLabelsImage;
