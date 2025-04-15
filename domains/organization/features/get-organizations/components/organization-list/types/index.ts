import { GetOrganizationsReturn } from "@/domains/organization";

export type OrganizationListProps = {
	organizationsPromise: Promise<GetOrganizationsReturn>;
};
