import calculateMriImageCoords from "./calculateMriImageCoords";
import calculateAdjustedMouseCoords from "./calculateAdjustedMouseCoords";

describe("unit tests for calculating correct mri image coords", () => {
	test("image coords return correctly with sagittal as props", () => {
		const currentPlane = "sagittal";
		const currentSlice = 83;
		const mouseX = 313;
		const mouseY = 173;

		const { adjustedSlice, adjustedMouseX, adjustedMouseY } =
			calculateAdjustedMouseCoords(currentPlane, currentSlice, mouseX, mouseY);

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedSlice,
				adjustedMouseX,
				adjustedMouseY
			)
		).toStrictEqual({
			sagittal: {
				slice: 83,
				mouseX: 313,
				mouseY: 173,
			},
			coronal: {
				slice: 313,
				mouseX: adjustedSlice,
				mouseY: 173,
			},
			axial: {
				slice: adjustedMouseY,
				mouseX: adjustedSlice,
				mouseY: adjustedMouseX,
			},
		});
	});

	test("image coords return correctly with coronal as props", () => {
		const currentPlane = "coronal";
		const currentSlice = 319;
		const mouseX = 98;
		const mouseY = 167;

		const { adjustedSlice, adjustedMouseX, adjustedMouseY } =
			calculateAdjustedMouseCoords(currentPlane, currentSlice, mouseX, mouseY);

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedSlice,
				adjustedMouseX,
				adjustedMouseY
			)
		).toStrictEqual({
			sagittal: {
				slice: adjustedMouseX,
				mouseX: 319,
				mouseY: 167,
			},
			coronal: {
				slice: 319,
				mouseX: 98,
				mouseY: 167,
			},
			axial: {
				slice: adjustedMouseY,
				mouseX: 98,
				mouseY: adjustedSlice,
			},
		});
	});

	test("image coords return correctly with axial as props", () => {
		const currentPlane = "axial";
		const currentSlice = 195;
		const mouseX = 158;
		const mouseY = 144;

		const { adjustedSlice, adjustedMouseX, adjustedMouseY } =
			calculateAdjustedMouseCoords(currentPlane, currentSlice, mouseX, mouseY);

		expect(
			calculateMriImageCoords(
				currentPlane,
				currentSlice,
				mouseX,
				mouseY,
				adjustedSlice,
				adjustedMouseX,
				adjustedMouseY
			)
		).toStrictEqual({
			sagittal: {
				slice: adjustedMouseX,
				mouseX: adjustedMouseY,
				mouseY: adjustedSlice,
			},
			coronal: {
				slice: adjustedMouseY,
				mouseX: 158,
				mouseY: adjustedSlice,
			},
			axial: {
				slice: 195,
				mouseX: 158,
				mouseY: 144,
			},
		});
	});
});
