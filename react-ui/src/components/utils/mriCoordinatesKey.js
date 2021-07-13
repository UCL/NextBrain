const mriCoordinatesKey = {
	sagittal: {
		width: 450,
		height: 362,
		slices: 226,
		coordinateMappings: {
			axisX: "slice",
			axisY: "mouseX",
			axisZ: "mouseY",
		},
	},
	coronal: {
		width: 226,
		height: 362,
		slices: 450,
		coordinateMappings: {
			axisX: "mouseX",
			axisY: "slice",
			axisZ: "mouseY",
		},
	},
	axial: {
		width: 226,
		height: 450,
		slices: 362,
		coordinateMappings: {
			axisX: "mouseX",
			axisY: "mouseY",
			axisZ: "slice",
		},
	},
};

export default mriCoordinatesKey;
