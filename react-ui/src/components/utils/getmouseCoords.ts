const getMouseCoords = (e: any, showHiRes: boolean) => {
	let mouseX = !showHiRes ? e.nativeEvent.offsetX : e.offsetX;
	let mouseY = !showHiRes ? e.nativeEvent.offsetY : e.offsetY;

	return { mouseX, mouseY };
};

export default getMouseCoords;
