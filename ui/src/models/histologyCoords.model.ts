export interface HistologyCoords {
	coordsLowRes: {
		mouseX: number;
		mouseY: number;
	};
	coordsHiRes: {
		mouseX: number;
		mouseY: number;
	};
	currentHistologySlice: number;
	currentHistologyBlock: number;
}
