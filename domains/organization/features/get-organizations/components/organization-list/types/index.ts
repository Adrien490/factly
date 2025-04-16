import { GetOrganizationsReturn } from "@/domains/organization/features/get-organizations";
import { ViewType } from "@/shared/types";

export type OrganizationListProps = {
	viewType: ViewType;
	organizationsPromise: Promise<GetOrganizationsReturn>;
};
