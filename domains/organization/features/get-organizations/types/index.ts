import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
	GET_ORGANIZATIONS_DEFAULT_SELECT,
	ORGANIZATION_SORTABLE_FIELDS,
} from "../constants";
import { getOrganizationsSchema } from "../schemas";

export type GetOrganizationsParams = z.infer<typeof getOrganizationsSchema>;

export type OrganizationWithCount = Prisma.OrganizationGetPayload<{
	select: {
		id: true;
		name: true;
		legalName: true;
		logoUrl: true;
		email: true;
		phone: true;
		website: true;
		siren: true;
		siret: true;
		vatNumber: true;
		addressLine1: true;
		addressLine2: true;
		postalCode: true;
		city: true;
		country: true;
		legalForm: true;
		createdAt: true;
		updatedAt: true;
		_count: {
			select: {
				members: true;
				clients: true;
			};
		};
	};
}>;

export type GetOrganizationsReturn = Array<
	Prisma.OrganizationGetPayload<{
		select: typeof GET_ORGANIZATIONS_DEFAULT_SELECT;
	}>
>;

export type OrganizationSortableField =
	(typeof ORGANIZATION_SORTABLE_FIELDS)[number];
