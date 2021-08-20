const getMouseCoords = (e) => {
	const mouseX = e.nativeEvent.offsetX;
	const mouseY = e.nativeEvent.offsetY;

	return { mouseX, mouseY };
};

export default getMouseCoords;
