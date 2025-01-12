import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

export default async function hasOrganizationAccess(organizationId: string) {
	const session = await auth();

	if (!session?.user?.id) {
		return false;
	}

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const membership = await db.organizationMembership.findFirst({
				where: {
					userId: session.user.id,
					organizationId,
				},
			});

			return !!membership;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError ||
				error instanceof Prisma.PrismaClientInitializationError
			) {
				if (attempt === MAX_RETRIES) {
					console.error("Database connection failed after max retries:", error);
					throw error;
				}
				// Attendre avant de réessayer
				await new Promise((resolve) =>
					setTimeout(resolve, RETRY_DELAY * attempt)
				);
				continue;
			}
			throw error;
		}
	}

	return false;
}
