import { render, screen } from "@testing-library/react";

import MriImage from "./MriImage";

describe("MriImage component", () => {
	test("mri image exists in the document with correct attributes passed down via props", () => {
		// Arrange
		// set up the test data, test conditions, and test environment
		const mriImageCoords = {
			sagittal: {
				slice: 99,
				mouseX: 234,
				mouseY: 55,
			},
			coronal: {
				slice: 55,
				mouseX: 234,
				mouseY: 99,
			},
			axial: {
				slice: 234,
				mouseX: 55,
				mouseY: 99,
			},
		};

		render(
			<MriImage
				plane="axial"
				mriImageCoords={mriImageCoords}
				showHiRes={false}
				computeMriImagesHandler={() => {}}
			/>
		);

		// Act
		// run logic that should be tested (e.g. fire action or execute function)

		// Assert
		// compare execution results with expected results
		const mriImage: any = screen.getByRole("img");
		screen.getByAltText(/axial/); // an alternative approach to getting the element using regex
		expect(mriImage).toBeInTheDocument();
		expect(mriImage.alt).toContain("slice234");
	});

	test("mouse pointer has correct coordinates based on props", () => {
		const mriImageCoords = {
			sagittal: {
				slice: 99,
				mouseX: 234,
				mouseY: 55,
			},
			coronal: {
				slice: 55,
				mouseX: 234,
				mouseY: 99,
			},
			axial: {
				slice: 234,
				mouseX: 55,
				mouseY: 99,
			},
		};

		const container = render(
			<MriImage
				plane="axial"
				mriImageCoords={mriImageCoords}
				showHiRes={false}
				computeMriImagesHandler={() => {}}
			/>
		);

		// get the mouse pointer manually (not best practice but is necessary in this case)
		const mousePointer = container.container.querySelector(".mouse-pointer");
		expect(mousePointer).toBeInTheDocument();
		expect(mousePointer).toHaveStyle("top: 99px");
		expect(mousePointer).toHaveStyle("left: 55px");
	});
});
