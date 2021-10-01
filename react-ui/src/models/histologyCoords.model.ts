export interface HistologyCoords {
	coordsLowRes: {
		slice: number;
		mouseX: number;
		mouseY: number;
	};
	coordsHiRes: {
		slice: number;
		mouseX: number;
		mouseY: number;
	};
	currentBlock: number;
	currentPlane: string;
}
