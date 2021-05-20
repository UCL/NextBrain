const mriCoordinatesKey = {
	sagittal: {
		width: 282,
		height: 484,
		coordinateMappings: {
			axisX: "mouseY",
			axisY: "slice",
			axisZ: "mouseX",
		},
	},
	coronal: {
		width: 282,
		height: 224,
		coordinateMappings: {
			axisX: "slice",
			axisY: "mouseY",
			axisZ: "mouseX",
		},
	},
	axial: {
		width: 448,
		height: 224,
		coordinateMappings: {
			axisX: "mouseX",
			axisY: "mouseY",
			axisZ: "slice",
		},
	},
};

export default mriCoordinatesKey;
