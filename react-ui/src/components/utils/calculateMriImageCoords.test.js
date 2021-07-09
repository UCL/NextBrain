import calculateMriImageCoords from "./calculateMriImageCoords";

describe("unit tests for calculating correct mri image coords", () => {
	// props order: plane, slice, mouseX, mouseY
	test("image coords return correctly with sagittal as props", () => {
		expect(calculateMriImageCoords("sagittal", 83, 313, 173)).toStrictEqual({
			axial: {
				slice: 189,
				mouseX: 143,
				mouseY: 137,
			},
			coronal: {
				slice: 313,
				mouseX: 143,
				mouseY: 173,
			},
			sagittal: {
				slice: 83,
				mouseX: 313,
				mouseY: 173,
			},
		});
	});

	test("image coords return correctly with coronal as props", () => {
		expect(calculateMriImageCoords("coronal", 319, 98, 167)).toStrictEqual({
			axial: {
				slice: 195,
				mouseX: 98,
				mouseY: 131,
			},
			coronal: {
				slice: 319,
				mouseX: 98,
				mouseY: 167,
			},
			sagittal: {
				slice: 128,
				mouseX: 319,
				mouseY: 167,
			},
		});
	});

	test("image coords return correctly with axial as props", () => {
		expect(calculateMriImageCoords("axial", 195, 158, 144)).toStrictEqual({
			axial: {
				slice: 195,
				mouseX: 158,
				mouseY: 144,
			},
			coronal: {
				slice: 306,
				mouseX: 158,
				mouseY: 167,
			},
			sagittal: {
				slice: 68,
				mouseX: 306,
				mouseY: 167,
			},
		});
	});
});
