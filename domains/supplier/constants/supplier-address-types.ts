import { ADDRESS_TYPES } from "@/domains/address/constants";
import { AddressType } from "@prisma/client";

export const SUPPLIER_ADDRESS_TYPES = ADDRESS_TYPES.filter(
	(type) =>
		type.value !== AddressType.BILLING && type.value !== AddressType.SHIPPING
);
