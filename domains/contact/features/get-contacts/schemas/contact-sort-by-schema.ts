import { z } from "zod";
import { GET_CONTACTS_SORT_FIELDS } from "../constants";

export const contactSortBySchema = z.enum(GET_CONTACTS_SORT_FIELDS);
