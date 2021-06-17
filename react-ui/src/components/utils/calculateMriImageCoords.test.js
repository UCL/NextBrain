import calculateMriImageCoords from "./calculateMriImageCoords";

describe("unit tests for calculating correct mri image coords", () => {
	// props order: plane, slice, mouseX, mouseY
	test("image coords return correctly with sagittal as props", () => {
		expect(calculateMriImageCoords("sagittal", 99, 163, 196)).toStrictEqual({
			axial: {
				slice: 163,
				mouseX: 196,
				mouseY: 99,
			},
			coronal: {
				slice: 196,
				mouseX: 163,
				mouseY: 99,
			},
			sagittal: {
				slice: 99,
				mouseX: 163,
				mouseY: 196,
			},
		});
	});

	test("image coords return correctly with coronal as props", () => {
		expect(calculateMriImageCoords("coronal", 196, 163, 99)).toStrictEqual({
			axial: {
				slice: 163,
				mouseX: 196,
				mouseY: 99,
			},
			coronal: {
				slice: 196,
				mouseX: 163,
				mouseY: 99,
			},
			sagittal: {
				slice: 99,
				mouseX: 163,
				mouseY: 196,
			},
		});
	});

	test("image coords return correctly with axial as props", () => {
		expect(calculateMriImageCoords("axial", 163, 196, 99)).toStrictEqual({
			axial: {
				slice: 163,
				mouseX: 196,
				mouseY: 99,
			},
			coronal: {
				slice: 196,
				mouseX: 163,
				mouseY: 99,
			},
			sagittal: {
				slice: 99,
				mouseX: 163,
				mouseY: 196,
			},
		});
	});
});
