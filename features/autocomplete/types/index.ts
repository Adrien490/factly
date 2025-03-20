import {
	AddressFeature,
	AddressProperty,
	AddressResponse,
} from "../schemas/address-result-schema";
import { SearchAddressParams } from "../schemas/search-address-schema";

export interface FormattedAddressResult {
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
}

export interface SearchAddressReturn {
	query: string;
	results: FormattedAddressResult[];
	total: number;
}

export type {
	AddressFeature,
	AddressProperty,
	AddressResponse,
	SearchAddressParams,
};
