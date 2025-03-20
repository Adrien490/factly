"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Tag } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import DeleteTagFormSchema from "../schemas/delete-tag-schema";

export default async function deleteTag(
	_: ServerActionState<Tag, typeof DeleteTagFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Tag, typeof DeleteTagFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer un tag"
			);
		}

		const rawData = {
			id: formData.get("id")?.toString() || "",
			organizationId: formData.get("organizationId")?.toString() || "",
		};

		// Validation des données
		const validationResult = DeleteTagFormSchema.safeParse(rawData);
		if (!validationResult.success) {
			return createValidationErrorResponse(
				validationResult.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const { data } = validationResult;

		// Vérifier l'accès à l'organisation
		const hasAccess = await db.member.findFirst({
			where: {
				userId: session.user.id,
				organizationId: data.organizationId,
			},
		});

		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// Vérifier si le tag existe
		const existingTag = await db.tag.findUnique({
			where: {
				id: data.id,
			},
		});

		if (!existingTag) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Le tag n'existe pas"
			);
		}

		// Vérifier si le tag appartient à l'organisation
		if (existingTag.organizationId !== data.organizationId) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Ce tag n'appartient pas à cette organisation"
			);
		}

		// Supprimer le tag
		const deletedTag = await db.tag.delete({
			where: {
				id: data.id,
			},
		});

		// Revalider le cache
		revalidateTag(`organization:${data.organizationId}:tags`);

		return createSuccessResponse(deletedTag, "Tag supprimé avec succès");
	} catch (error) {
		console.error("Erreur lors de la suppression du tag:", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de la suppression du tag"
		);
	}
}
