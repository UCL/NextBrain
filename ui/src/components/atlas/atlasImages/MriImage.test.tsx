import MriImage from "./MriImage";

import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
	configure,
} from "@testing-library/react";

//configure({ asyncUtilTimeout: 5000 });

describe("MriImage component", () => {
	test("mri image exists in the document with correct attributes passed down via props", async () => {
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
				computeMriImagesHandler={() => {}}
				patientId="BrainAtlas-P57-16/main/P57-16"
			/>
		);

		// Act
		// run logic that should be tested (e.g. fire action or execute function)

		//await waitForElementToBeRemoved(await screen.findByText("Loading..."));

		// Assert
		// compare execution results with expected results
		const mriImage: any = await screen.findByRole("img");
		screen.getByAltText(/axial/); // an alternative approach to getting the element using regex
		expect(mriImage).toBeInTheDocument();
		expect(mriImage.alt).toContain("slice234");

		// await waitFor(async () => {
		// 	expect(screen.getByRole("img")).toBeInTheDocument();
		// });
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
				computeMriImagesHandler={() => {}}
				patientId="BrainAtlas-P57-16/main/P57-16"
			/>
		);

		// get the mouse pointer manually (not best practice but is necessary in this case)
		const mousePointer = container.container.querySelector(".mouse-pointer");
		expect(mousePointer).toBeInTheDocument();
		expect(mousePointer).toHaveStyle("top: 99px");
		expect(mousePointer).toHaveStyle("left: 55px");
	});
});
