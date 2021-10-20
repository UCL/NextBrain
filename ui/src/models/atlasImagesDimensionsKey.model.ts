interface mriDimensionsKey {
	[key: string]: string;
}

export interface AtlasImagesDimensionsKey {
	[key: string]: {
		[key: string]: {
			[key: string]: number | mriDimensionsKey;
		};
	};
}
