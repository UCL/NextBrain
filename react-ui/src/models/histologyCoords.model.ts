export interface HistologyCoords {
	coords: {
		slice: number;
		mouseX: number;
		mouseY: number;
	};
	currentBlock: number;
	currentPlane: string;
}
