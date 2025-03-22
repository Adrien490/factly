"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import { headers } from "next/headers";

export default async function getPendingInvitationsCount(): Promise<number> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("User not found");
		}

		// Get count directly without timeout
		const count = await db.invitation.count({
			where: {
				email: session.user.email,
				status: "PENDING",
			},
		});

		return count;
	} catch (error) {
		console.error("Error in getPendingInvitationsCount:", error);
		return 0;
	}
}
