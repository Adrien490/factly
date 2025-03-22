"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Tag } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import TagFormSchema from "../schemas/create-tag-schema";

export default async function updateTag(
	_: ServerActionState<Tag, typeof TagFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Tag, typeof TagFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour mettre à jour un tag"
			);
		}

		const tagId = formData.get("id")?.toString();
		if (!tagId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'ID du tag est requis"
			);
		}

		const rawData = {
			name: formData.get("name")?.toString() || "",
			type: formData.get("type")?.toString() || "",
			color: formData.get("color")?.toString() || null,
			description: formData.get("description")?.toString() || null,
			organizationId: formData.get("organizationId")?.toString() || "",
		};

		// Validation des données
		const validationResult = TagFormSchema.safeParse(rawData);
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
				id: tagId,
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

		// Vérifier si un autre tag avec le même nom existe déjà dans l'organisation
		const duplicateTag = await db.tag.findFirst({
			where: {
				name: data.name,
				organizationId: data.organizationId,
				id: {
					not: tagId,
				},
			},
		});

		if (duplicateTag) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Un autre tag avec ce nom existe déjà dans cette organisation"
			);
		}

		// Mettre à jour le tag
		const updatedTag = await db.tag.update({
			where: {
				id: tagId,
			},
			data: {
				name: data.name,
				type: data.type,
				color: data.color,
				description: data.description,
			},
		});

		// Revalider le cache
		revalidateTag(`organization:${data.organizationId}:tags`);
		revalidateTag(`tag:${tagId}`);

		return createSuccessResponse(updatedTag, "Tag mis à jour avec succès");
	} catch (error) {
		console.error("Erreur lors de la mise à jour du tag:", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du tag"
		);
	}
}
