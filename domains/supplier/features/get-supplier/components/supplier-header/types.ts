import { SupplierStatus, SupplierType } from "@prisma/client";

export interface Supplier {
	id: string;
	name: string;
	status: SupplierStatus;
	supplierType: SupplierType;
	organizationId: string;
	registrationNumber?: string;
	email?: string;
	phone?: string;
	addresses?: { isDefault: boolean }[];
	contacts?: { id: string; name: string; email?: string; phone?: string }[];
}

export interface SupplierHeaderProps {
	supplierPromise: Promise<Supplier | null>;
}
