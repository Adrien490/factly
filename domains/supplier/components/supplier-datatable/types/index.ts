import { GetSuppliersReturn } from "@/domains/supplier/features/get-suppliers";

export interface SupplierDataTableProps {
	suppliersPromise: Promise<GetSuppliersReturn>;
}
