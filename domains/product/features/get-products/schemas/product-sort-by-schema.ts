import { z } from "zod";
import {
	GET_PRODUCTS_DEFAULT_SORT_BY,
	GET_PRODUCTS_SORT_FIELDS,
} from "../constants";

export const productSortBySchema = z.preprocess((val) => {
	return typeof val === "string" &&
		GET_PRODUCTS_SORT_FIELDS.includes(
			val as (typeof GET_PRODUCTS_SORT_FIELDS)[number]
		)
		? val
		: GET_PRODUCTS_DEFAULT_SORT_BY;
}, z.enum(GET_PRODUCTS_SORT_FIELDS));
