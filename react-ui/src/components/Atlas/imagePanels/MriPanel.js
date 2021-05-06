import "./MriPanel.css";

const MriPanel = (props) => {
	const {
		plane,
		mriSlices,
		calculateMriImages,
		mriDimensions,
		coronalRescalingFactor,
	} = props;

	const paddedSlice = props.mriSlices[plane]["slice"].toString().padStart(3, 0);
	const mriImage = require(`../../../assets/mri/slices_${plane}/slice_${paddedSlice}.png`)
		.default;

	const getCoords = (e) => {
		const xCoordinate = e.nativeEvent.offsetX;
		const yCoordinate = e.nativeEvent.offsetY;

		if (xCoordinate < 0 || yCoordinate < 0) return;

		if (plane === "sagittal") {
			// constrain coordinates to the current image dimensions
			if (xCoordinate > 281 || yCoordinate > 447) return;

			calculateMriImages(
				plane,
				yCoordinate.toFixed(0),
				undefined,
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "coronal") {
			// constrain coordinates to the current image dimensions
			// also accounting for coronal rescaling
			if (
				xCoordinate > 281 * coronalRescalingFactor ||
				yCoordinate > 223 * coronalRescalingFactor
			)
				return;

			calculateMriImages(
				plane,
				undefined,
				yCoordinate.toFixed(0),
				xCoordinate.toFixed(0),
				mriSlices[plane]["slice"]
			);
		}

		if (plane === "axial") {
			// constrain coordinates to the current image dimensions
			if (xCoordinate > 447 || yCoordinate > 223) return;

			calculateMriImages(
				plane,
				xCoordinate.toFixed(0),
				yCoordinate.toFixed(0),
				undefined,
				mriSlices[plane]["slice"]
			);
		}
	};

	return (
		<div className={`side-panel ${plane}`}>
			{/* <div className="debug-info">
				<div>{plane}</div>
				<div>
					{Object.keys(mriSlices[plane]).map((prop, index) => (
						<React.Fragment key={index}>
							<div>
								<strong>{prop}: </strong>
								<strong>{mriSlices[plane][prop]} </strong>
							</div>
						</React.Fragment>
					))}
					{Object.keys(mriDimensions[plane]).map((prop, index) => (
						<React.Fragment key={index}>
							<div>
								<strong>{prop}: </strong>
								<strong>{mriDimensions[plane][prop]} </strong>
							</div>
						</React.Fragment>
					))}
				</div>
			</div> */}

			<div className={`img-container ${plane}`}>
				<div className="border-left"></div>
				<div
					className="target-pointer"
					// - 5 to account for element width and border offsets
					style={{
						top: +mriSlices[plane].targetTop - 5,
						left: +mriSlices[plane].targetLeft - 5,
					}}
				></div>

				<img
					onClick={(e) => getCoords(e)}
					className={`${plane}-img`}
					src={mriImage}
					alt={`${plane}-img`}
				></img>
			</div>
		</div>
	);
};

export default MriPanel;
