export type FormattedAddressResult = {
	id: string;
	label: string;
	value?: string;
	type: "housenumber" | "street" | "locality" | "municipality" | string;
	city: string;
	postcode: string;
	housenumber?: string;
	street?: string;
	district?: string;
	context?: string;
	score?: number;
	coordinates?: [number, number]; // [longitude, latitude]
};

export type SearchAddressReturn = {
	results: FormattedAddressResult[];
	metadata: {
		query: string;
		limit: number;
		attribution: string;
		licence: string;
	};
};

export interface SearchAddressParams {
	query: string;
	limit?: number;
	type?: "housenumber" | "street" | "locality" | "municipality";
	postcode?: string;
	citycode?: string;
	lat?: number;
	lon?: number;
	autocomplete?: boolean;
}
