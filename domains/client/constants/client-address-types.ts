import { ADDRESS_TYPE_OPTIONS } from "@/domains/address/constants/address-type-options";
import { AddressType } from "@prisma/client";

export const CLIENT_ADDRESS_TYPES = ADDRESS_TYPE_OPTIONS.filter(
	(type) =>
		type.value !== AddressType.COMMERCIAL &&
		type.value !== AddressType.WAREHOUSE &&
		type.value !== AddressType.PRODUCTION &&
		type.value !== AddressType.HEADQUARTERS
);
