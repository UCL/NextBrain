// the returned mouse coords are relative to the scale of its parent container
// for instance if the parent container image is 1000 x 1000 but has been scaled with css (e.g. max-height: 500px)
// then the returned mouse coords will be relative to this new scale
// for this reason, some components also run additional functions to calculate the natural x and y coords

// not sure why this union type isnt working
// type MouseCoords = React.MouseEvent | MouseEvent;

const getMouseCoords = (e: any, showHiRes: boolean) => {
	const mouseX = !showHiRes ? e.nativeEvent.offsetX : e.offsetX;
	const mouseY = !showHiRes ? e.nativeEvent.offsetY : e.offsetY;

	return { mouseX, mouseY };
};

export default getMouseCoords;
