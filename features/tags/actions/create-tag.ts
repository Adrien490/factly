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
import TagFormSchema from "../schemas/create-tag-schema";

export default async function createTag(
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
				"Vous devez être connecté pour créer un tag"
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

		// Vérifier si un tag avec le même nom existe déjà dans l'organisation
		const existingTag = await db.tag.findFirst({
			where: {
				name: data.name,
				organizationId: data.organizationId,
			},
		});

		if (existingTag) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Un tag avec ce nom existe déjà dans cette organisation"
			);
		}

		// Créer le tag
		const tag = await db.tag.create({
			data: {
				name: data.name,
				type: data.type,
				color: data.color,
				description: data.description,
				organizationId: data.organizationId,
			},
		});

		// Revalider le cache
		revalidateTag(`organization:${data.organizationId}:tags`);

		return createSuccessResponse(tag, "Tag créé avec succès");
	} catch (error) {
		console.error("Erreur lors de la création du tag:", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de la création du tag"
		);
	}
}
