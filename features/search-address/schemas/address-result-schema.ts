import { z } from "zod";

export const addressPropertySchema = z.object({
	label: z.string(),
	score: z.number(),
	housenumber: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	postcode: z.string(),
	citycode: z.string(),
	x: z.number(),
	y: z.number(),
	city: z.string(),
	context: z.string(),
	type: z.enum(["housenumber", "street", "locality", "municipality"]),
	importance: z.number(),
	street: z.string().optional(),
	district: z.string().optional(),
	oldcitycode: z.string().optional(),
	oldcity: z.string().optional(),
	locality: z.string().optional(),
});

export const addressGeometrySchema = z.object({
	type: z.literal("Point"),
	coordinates: z.tuple([z.number(), z.number()]),
});

export const addressFeatureSchema = z.object({
	type: z.literal("Feature"),
	geometry: addressGeometrySchema,
	properties: addressPropertySchema,
});

export const addressResponseSchema = z.object({
	type: z.literal("FeatureCollection"),
	version: z.string().optional().default(""),
	features: z.array(addressFeatureSchema),
	attribution: z
		.string()
		.optional()
		.default("API Adresse (Base Adresse Nationale)"),
	licence: z.string().optional().default("ODbL 1.0"),
	query: z.string().optional().default(""),
	limit: z.number().optional().default(5),
});

export type AddressProperty = z.infer<typeof addressPropertySchema>;
export type AddressGeometry = z.infer<typeof addressGeometrySchema>;
export type AddressFeature = z.infer<typeof addressFeatureSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;
