import calculateMriImageCoords from "./calculateMriImageCoords";

describe("unit tests for calculating correct mri image coords", () => {
	test("image coords return correctly with sagittal as props", () => {
		const currentPlane = "sagittal";
		const currentSlice = 83;
		const mouseX = 313;
		const mouseY = 173;

		const adjustedMriSlice = 143;
		const adjustedMriMouseX = 137;
		const adjustedMriMouseY = 189;

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedMriSlice!,
				adjustedMriMouseX!,
				adjustedMriMouseY!
			)
		).toStrictEqual({
			sagittal: {
				slice: 83,
				mouseX: 313,
				mouseY: 173,
			},
			coronal: {
				slice: 313,
				mouseX: adjustedMriSlice,
				mouseY: 173,
			},
			axial: {
				slice: adjustedMriMouseY,
				mouseX: adjustedMriSlice,
				mouseY: adjustedMriMouseX,
			},
		});
	});

	test("image coords return correctly with coronal as props", () => {
		const currentPlane = "coronal";
		const currentSlice = 319;
		const mouseX = 98;
		const mouseY = 167;

		const adjustedMriSlice = 131;
		const adjustedMriMouseX = 128;
		const adjustedMriMouseY = 195;

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedMriSlice!,
				adjustedMriMouseX!,
				adjustedMriMouseY!
			)
		).toStrictEqual({
			sagittal: {
				slice: adjustedMriMouseX,
				mouseX: 319,
				mouseY: 167,
			},
			coronal: {
				slice: 319,
				mouseX: 98,
				mouseY: 167,
			},
			axial: {
				slice: adjustedMriMouseY,
				mouseX: 98,
				mouseY: adjustedMriSlice,
			},
		});
	});

	test("image coords return correctly with axial as props", () => {
		const currentPlane = "axial";
		const currentSlice = 195;
		const mouseX = 158;
		const mouseY = 144;

		const adjustedMriSlice = 238;
		const adjustedMriMouseX = 77;
		const adjustedMriMouseY = 93;

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedMriSlice!,
				adjustedMriMouseX!,
				adjustedMriMouseY!
			)
		).toStrictEqual({
			sagittal: {
				slice: adjustedMriMouseX,
				mouseX: adjustedMriMouseY,
				mouseY: adjustedMriSlice,
			},
			coronal: {
				slice: adjustedMriMouseY,
				mouseX: 158,
				mouseY: adjustedMriSlice,
			},
			axial: {
				slice: 195,
				mouseX: 158,
				mouseY: 144,
			},
		});
	});
});
