const getMouseCoords = (e: React.MouseEvent) => {
	const mouseX = e.nativeEvent.offsetX;
	const mouseY = e.nativeEvent.offsetY;

	return { mouseX, mouseY };
};

export default getMouseCoords;
