import { render, screen } from "@testing-library/react";

import MriImage from "./MriImage";

describe("MriImage component", () => {
	test("mri image exists in the document with correct attributes passed down via props", () => {
		// Arrange
		// set up the test data, test conditions, and test environment
		const mriImageCoords = {
			sagittal: {
				slice: 113,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 149,
				mouseY: 235,
			},
			coronal: {
				slice: 235,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 223.5,
				mouseY: 169.5,
			},
			axial: {
				slice: 149,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 235,
				mouseY: 113,
			},
		};
		render(<MriImage plane="axial" mriImageCoords={mriImageCoords} />);

		// Act
		// run logic that should be tested (e.g. fire action or execute function)

		// Assert
		// compare execution results with expected results
		const mriImage = screen.getByRole("img");
		screen.getByAltText(/axial/); // an alternative approach to getting the element using regex
		expect(mriImage).toBeInTheDocument();
		expect(mriImage.alt).toContain("slice149");
	});

	test("mouse pointer has correct coordinates based on props", () => {
		const mriImageCoords = {
			sagittal: {
				slice: 113,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 149,
				mouseY: 235,
			},
			coronal: {
				slice: 235,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 223.5,
				mouseY: 169.5,
			},
			axial: {
				slice: 149,
				axisX: 235,
				axisY: 113,
				axisZ: 149,
				mouseX: 235,
				mouseY: 113,
			},
		};
		const container = render(
			<MriImage plane="axial" mriImageCoords={mriImageCoords} />
		);

		// get the mouse pointer manually (not best practice but is necessary in this case)
		const mousePointer = container.container.querySelector(".mouse-pointer");
		expect(mousePointer).toBeInTheDocument();
		expect(mousePointer).toHaveStyle("top: 108px"); // equal to the props minus 5px
		expect(mousePointer).toHaveStyle("left: 230px"); // equal to the props minus 5px
	});
});
