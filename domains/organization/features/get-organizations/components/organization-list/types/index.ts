import { GetOrganizationsReturn } from "@/domains/organization";
import { ViewType } from "@/shared/types";

export type OrganizationListProps = {
	viewType: ViewType;
	organizationsPromise: Promise<GetOrganizationsReturn>;
};
