import "./MriPanel.css";

const MriPanel = (props) => {
	const {
		plane,
		mriImages,
		calculateMriImages,
		mriDimensions,
		coronalRescalingFactor,
	} = props;

	const paddedSlice = props.mriImages[plane]["slice"].toString().padStart(3, 0);
	const mriImage =
		require(`../../../assets/mri/slices_${plane}/slice_${paddedSlice}.png`).default;

	const getMouseCoords = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;

		calculateMriImagesHandler(mouseX, mouseY);
	};

	// see readme for more details on how the mri coordinates are calculated
	const calculateMriImagesHandler = (mouseX, mouseY) => {
		if (mouseX < 0 || mouseY < 0) return;

		if (plane === "sagittal") {
			// constrain coordinates to the current image dimensions
			if (mouseX > 281 || mouseY > 447) return;

			calculateMriImages(
				plane,
				mouseY.toFixed(0),
				undefined,
				mouseX.toFixed(0),
				mriImages[plane]["slice"]
			);
		}

		if (plane === "coronal") {
			// constrain coordinates to the current image dimensions
			// also accounting for coronal rescaling
			if (
				mouseX > 281 * coronalRescalingFactor ||
				mouseY > 223 * coronalRescalingFactor
			)
				return;

			calculateMriImages(
				plane,
				undefined,
				mouseY.toFixed(0),
				mouseX.toFixed(0),
				mriImages[plane]["slice"]
			);
		}

		if (plane === "axial") {
			// constrain coordinates to the current image dimensions
			if (mouseX > 447 || mouseY > 223) return;

			calculateMriImages(
				plane,
				mouseX.toFixed(0),
				mouseY.toFixed(0),
				undefined,
				mriImages[plane]["slice"]
			);
		}
	};

	return (
		<div className={`side-panel ${plane}`}>
			{/* <div className="debug-info">
				<div>{plane}</div>
				<div>
					{Object.keys(mriImages[plane]).map((prop, index) => (
						<React.Fragment key={index}>
							<div>
								<strong>{prop}: </strong>
								<strong>{mriImages[plane][prop]} </strong>
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
						top: +mriImages[plane].mouseY - 5,
						left: +mriImages[plane].mouseX - 5,
					}}
				></div>

				<img
					onClick={(e) => getMouseCoords(e)}
					className={`${plane}-img`}
					src={mriImage}
					alt={`${plane}-img`}
				></img>
			</div>
		</div>
	);
};

export default MriPanel;
