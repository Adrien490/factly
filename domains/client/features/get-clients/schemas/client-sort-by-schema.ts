import { z } from "zod";
import {
	GET_CLIENTS_DEFAULT_SORT_BY,
	GET_CLIENTS_SORT_FIELDS,
} from "../constants";

export const clientSortBySchema = z.preprocess((val) => {
	return typeof val === "string" &&
		GET_CLIENTS_SORT_FIELDS.includes(
			val as (typeof GET_CLIENTS_SORT_FIELDS)[number]
		)
		? val
		: GET_CLIENTS_DEFAULT_SORT_BY;
}, z.enum(GET_CLIENTS_SORT_FIELDS));
