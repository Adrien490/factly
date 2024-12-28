"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import type { CheckReferenceState } from "@/lib/schemas/reference-schema";
import referenceSchema from "@/lib/schemas/reference-schema";
import { ServerActionStatus } from "@/lib/types/server-action";
export default async function checkClientReference(
	_: CheckReferenceState | null,
	formData: FormData
): Promise<CheckReferenceState> {
	try {
		// Check authentication
		const session = await auth();
		if (!session?.user) {
			return {
				status: ServerActionStatus.UNAUTHORIZED,
				message: "You must be logged in to perform this action",
			};
		}
		const rawReference = formData.get("reference") as string;

		// Validate reference format
		const validationResult = referenceSchema.safeParse(rawReference);
		if (!validationResult.success) {
			return {
				status: ServerActionStatus.VALIDATION_ERROR,
				message: "Invalid reference format",
				errors: validationResult.error.flatten().formErrors,
			};
		}

		// Check if reference exists in database
		const existingClient = await db.client.findFirst({
			where: { reference: validationResult.data },
			select: { id: true },
		});

		if (existingClient) {
			return {
				status: ServerActionStatus.ERROR,
				message: "This reference is already in use",
			};
		}

		// Reference is valid and available
		return {
			status: ServerActionStatus.SUCCESS,
			message: "Reference is available",
		};
	} catch (error) {
		console.error("Reference check error:", error);
		return {
			status: ServerActionStatus.ERROR,
			message: "Failed to check reference availability",
		};
	}
}
