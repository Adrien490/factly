"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

import { ServerActionStatus } from "@/types/server-action";
import { headers } from "next/headers";
import OrganizationFormSchema from "../schemas/organization-form-schema";

export default async function updateOrganization(
	state: unknown,
	formData: FormData
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return {
				status: ServerActionStatus.ERROR,
				message: "Vous devez être connecté pour modifier une organisation",
			};
		}

		const validatedFields = OrganizationFormSchema.parse(
			Object.fromEntries(formData.entries())
		);

		const organization = await db.organization.update({
			where: { id: validatedFields.id },
			data: validatedFields,
		});

		return {
			status: ServerActionStatus.SUCCESS,
			data: organization,
			message: "Organisation modifiée avec succès",
		};
	} catch (error) {
		console.error(error);
		return {
			status: ServerActionStatus.ERROR,
			message: "Erreur lors de la modification de l'organisation",
		};
	}
}
