import { Company, Organization } from "@prisma/client";

export type CreateOrganizationReturn = Organization & {
	company: Company | null;
};
