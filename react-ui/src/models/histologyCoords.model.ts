export interface HistologyCoords {
	coords: {
		slice: string;
		mouseX: number;
		mouseY: number;
	};
	currentBlock: number;
	currentPlane: string;
}
