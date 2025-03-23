import {
	AddressFeature,
	AddressProperty,
	AddressResponse,
} from "@/features/address-api/schemas/address-result-schema";
import { SearchAddressParams } from "@/features/address-api/schemas/search-address-schema";

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
	query: string;
	results: FormattedAddressResult[];
	total: number;
};

export type {
	AddressFeature,
	AddressProperty,
	AddressResponse,
	SearchAddressParams,
};
