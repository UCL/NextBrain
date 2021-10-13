interface CoordinateMappings {
	[key: string]: string;
}

export interface MriCoordsKey {
	[key: string]: {
		[key: string]: number | CoordinateMappings;
	};
}
