import { GetSuppliersReturn } from "@/domains/supplier/features/get-suppliers";

export interface DeleteSupplierFormProps {
	supplier: GetSuppliersReturn["suppliers"][number];
}
