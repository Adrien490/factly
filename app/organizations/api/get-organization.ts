"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

const DEFAULT_SELECT = {
	id: true,
	name: true,
	siren: true,
	legalForm: true,
	vatNumber: true,
	vatOptionDebits: true,
	rcsNumber: true,
	capital: true,
	address: true,
	city: true,
	zipCode: true,
	country: true,
	phone: true,
	email: true,
	website: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.OrganizationSelect;

export default async function getOrganization(id: string) {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Vous devez être connecté pour voir cette organisation");
	}

	const organization = await db.organization.findFirst({
		where: {
			id,
			memberships: {
				some: {
					userId: session.user.id,
				},
			},
		},
		select: DEFAULT_SELECT,
	});

	if (!organization) {
		notFound();
	}

	return organization;
}
