interface mriPlaneMapping {
	[key: string]: string;
}

export interface AtlasImagesDimensionsKey {
	[key: string]: {
		[key: string]: {
			[key: string]: number | mriPlaneMapping;
		};
	};
}
