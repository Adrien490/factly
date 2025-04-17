import { GetSuppliersReturn } from "@/domains/supplier/features/get-suppliers";

export interface SupplierRowActionsProps {
	supplier: GetSuppliersReturn["suppliers"][number];
}
