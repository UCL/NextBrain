import calculateMriImageCoords from "./calculateMriImageCoords";

describe("unit tests for calculating correct mri image coords", () => {
	// props order: plane, slice, axisX, axisY, axisZ
	test("image coords return correctly with sagittal as props", () => {
		expect(
			calculateMriImageCoords("sagittal", 113, 235, 113, 149)
		).toStrictEqual({
			axial: {
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 235,
				mouseY: 113,
				slice: 149,
			},
			coronal: {
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 223.5,
				mouseY: 169.5,
				slice: 235,
			},
			sagittal: {
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 149,
				mouseY: 235,
				slice: 113,
			},
		});
	});

	test("image coords return correctly with coronal as props", () => {
		expect(calculateMriImageCoords("coronal", 4, 10, 7, 4)).toStrictEqual({
			axial: {
				axisX: 10,
				axisY: 5,
				axisZ: 3,
				mouseX: 4,
				mouseY: 5,
				slice: 3,
			},
			coronal: {
				axisX: 10,
				axisY: 5,
				axisZ: 3,
				mouseX: 4.5,
				mouseY: 7.5,
				slice: 4,
			},
			sagittal: {
				axisX: 10,
				axisY: 5,
				axisZ: 3,
				mouseX: 3,
				mouseY: 4,
				slice: 5,
			},
		});
	});

	test("image coords return correctly with axial as props", () => {
		expect(calculateMriImageCoords("axial", 4, 10, 7, 4)).toStrictEqual({
			axial: {
				axisX: 10,
				axisY: 7,
				axisZ: 4,
				mouseX: 10,
				mouseY: 7,
				slice: 4,
			},
			coronal: {
				axisX: 10,
				axisY: 7,
				axisZ: 4,
				mouseX: 6,
				mouseY: 10.5,
				slice: 10,
			},
			sagittal: {
				axisX: 10,
				axisY: 7,
				axisZ: 4,
				mouseX: 4,
				mouseY: 10,
				slice: 7,
			},
		});
	});
});
