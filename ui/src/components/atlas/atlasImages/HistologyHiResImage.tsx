import { FC, SyntheticEvent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import MousePointer from "../../shared/MousePointer";

interface Props {
	histologyImage: string;
	labelsImage: string;
	labelsTransparency: string;
	showHiRes: boolean;
	showLabels: boolean;
	updateHistologyCoordsHandler: (e: SyntheticEvent | Event) => void;
	onImageLoad: (e: SyntheticEvent) => void;
	scaledHistologyMouseCoords: {
		[key: string]: number;
	} | null;
}

// to allow the zooming feature, the hi-res image needs access to both the mouse pointer and labels image
const HistologyHiResImage: FC<Props> = (props) => {
	const {
		histologyImage,
		labelsImage,
		labelsTransparency,
		showHiRes,
		showLabels,
		updateHistologyCoordsHandler,
		onImageLoad,
		scaledHistologyMouseCoords,
	} = props;

	const onPan = (ref: any, e: Event) => {
		updateHistologyCoordsHandler(e);
	};

	return (
		<TransformWrapper
			wheel={{ disabled: false }}
			panning={{ velocityDisabled: true }}
			limitToBounds={true}
			onPanningStart={onPan}
			maxScale={15}
		>
			{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
				<>
					<div className="tools">
						<button onClick={() => zoomIn()}>+</button>
						<button onClick={() => zoomOut()}>-</button>
						<button onClick={() => resetTransform()}>x</button>
					</div>

					<TransformComponent>
						{scaledHistologyMouseCoords && (
							<MousePointer
								mouseY={scaledHistologyMouseCoords.mouseY}
								mouseX={scaledHistologyMouseCoords.mouseX}
							/>
						)}

						{showLabels && (
							<img
								className="histology-img-labels"
								src={labelsImage}
								alt="histology-labels"
								style={{ opacity: `${labelsTransparency}` }}
							></img>
						)}

						<img
							className={`histology-img ${showHiRes && "hi-res"}`}
							src={histologyImage}
							alt="histology"
							onLoad={(e) => onImageLoad(e)}
						></img>
					</TransformComponent>
				</>
			)}
		</TransformWrapper>
	);
};

export default HistologyHiResImage;
