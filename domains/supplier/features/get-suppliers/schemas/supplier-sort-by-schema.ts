import { z } from "zod";
import {
	GET_SUPPLIERS_DEFAULT_SORT_BY,
	GET_SUPPLIERS_SORT_FIELDS,
} from "../constants";

export const supplierSortBySchema = z.preprocess((val) => {
	return typeof val === "string" &&
		GET_SUPPLIERS_SORT_FIELDS.includes(
			val as (typeof GET_SUPPLIERS_SORT_FIELDS)[number]
		)
		? val
		: GET_SUPPLIERS_DEFAULT_SORT_BY;
}, z.enum(GET_SUPPLIERS_SORT_FIELDS));
