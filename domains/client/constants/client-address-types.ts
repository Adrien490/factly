import { ADDRESS_TYPES } from "@/domains/address/constants";
import { AddressType } from "@prisma/client";

export const CLIENT_ADDRESS_TYPES = ADDRESS_TYPES.filter(
	(type) =>
		type.value !== AddressType.COMMERCIAL &&
		type.value !== AddressType.WAREHOUSE &&
		type.value !== AddressType.PRODUCTION &&
		type.value !== AddressType.HEADQUARTERS
);
