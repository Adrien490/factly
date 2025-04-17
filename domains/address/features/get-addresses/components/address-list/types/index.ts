import { GetAddressesReturn } from "@/domains/address/features/get-addresses/types";
import { ViewType } from "@/shared/types";

export type AddressListProps = {
	viewType: ViewType;
	addressesPromise: Promise<GetAddressesReturn>;
	clientId?: string;
	supplierId?: string;
};
