const getMouseCoords = (e) => {
	const mouseX = e.nativeEvent.offsetX;
	const mouseY = e.nativeEvent.offsetY;

	console.log(mouseX);

	return { mouseX, mouseY };
};

export default getMouseCoords;
