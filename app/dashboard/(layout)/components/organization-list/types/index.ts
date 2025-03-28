import { GetOrganizationsReturn } from "@/features/organization";

export type OrganizationListProps = {
	organizationsPromise: Promise<GetOrganizationsReturn>;
};
