import { SupplierType } from "@prisma/client";

export interface SupplierTypeOption {
	value: SupplierType;
	label: string;
	description: string;
}
