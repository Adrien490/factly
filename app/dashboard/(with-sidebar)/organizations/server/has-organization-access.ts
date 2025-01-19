import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";

export default async function hasOrganizationAccess(organizationId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return false;
	}

	const organization = await db.organization.findUnique({
		where: { id: organizationId },
		select: { id: true },
	});

	if (!organization) {
		return false;
	}

	return true;
}
