import { ProductCategory as PrismaProductCategory } from "@prisma/client";
import { z } from "zod";
import { getProductCategorySchema } from "../schemas";

// Type pour une catégorie de produit
export type ProductCategory = PrismaProductCategory;

// Type de retour
export type GetProductCategoryReturn = ProductCategory | null;

export type GetProductCategoryParams = z.infer<typeof getProductCategorySchema>;
