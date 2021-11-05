interface Data {
	[key: string]: number;
}

interface Children {
	[key: string]: {
		[key: string]: Data | string;
	};
}

export interface AtlasNavigationData {
	[key: string]: {
		[key: string]: Data | Children | string;
	};
}
