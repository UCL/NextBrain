interface HistologyMouseCoords {
	[key: string]: {
		[key: string]: number;
	};
}

export interface HistologyCoords {
	[key: string]: number | HistologyMouseCoords;
}
