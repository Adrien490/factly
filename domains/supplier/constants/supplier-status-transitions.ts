import { SupplierStatus } from "@prisma/client";

export const SUPPLIER_STATUS_TRANSITIONS: Record<
	SupplierStatus,
	SupplierStatus[]
> = {
	[SupplierStatus.ACTIVE]: [
		SupplierStatus.INACTIVE,
		SupplierStatus.BLOCKED,
		SupplierStatus.ARCHIVED,
	],
	[SupplierStatus.INACTIVE]: [
		SupplierStatus.ACTIVE,
		SupplierStatus.BLOCKED,
		SupplierStatus.ARCHIVED,
	],
	[SupplierStatus.ONBOARDING]: [
		SupplierStatus.ACTIVE,
		SupplierStatus.BLOCKED,
		SupplierStatus.ARCHIVED,
	],
	[SupplierStatus.BLOCKED]: [
		SupplierStatus.ACTIVE,
		SupplierStatus.INACTIVE,
		SupplierStatus.ARCHIVED,
	],
	[SupplierStatus.ARCHIVED]: [
		SupplierStatus.ACTIVE,
		SupplierStatus.INACTIVE,
		SupplierStatus.ONBOARDING,
		SupplierStatus.BLOCKED,
	],
};
