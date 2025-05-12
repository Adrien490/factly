import { ADDRESS_TYPE_OPTIONS } from "@/domains/address/constants";
import { AddressType } from "@prisma/client";

export const SUPPLIER_ADDRESS_TYPE_OPTIONS = ADDRESS_TYPE_OPTIONS.filter(
	(type) =>
		type.value !== AddressType.BILLING && type.value !== AddressType.SHIPPING
);
