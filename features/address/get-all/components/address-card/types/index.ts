import { ViewType } from "@/shared/types";
import { GetAddressesReturn } from "../../../types";

export type AddressCardProps = {
	address: GetAddressesReturn[0];
	viewMode?: ViewType;
};
