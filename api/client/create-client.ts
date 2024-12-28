// actions/clients/create-client.ts
"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import type { ClientFormState } from "@/lib/schemas/client-form-schema";
import { ClientFormSchema } from "@/lib/schemas/client-form-schema";
import { ServerActionStatus } from "@/lib/types/server-action";

export default async function createClient(
	_: ClientFormState | null,
	formData: FormData
): Promise<ClientFormState> {
	try {
		// Vérifier l'authentification
		const session = await auth();
		if (!session?.user) {
			return {
				status: ServerActionStatus.UNAUTHORIZED,
				message: "You must be logged in to create a client",
			};
		}

		// Extraire et valider les données
		const rawData = Object.fromEntries(formData.entries());
		const validation = ClientFormSchema.safeParse(rawData);

		if (!validation.success) {
			return {
				status: ServerActionStatus.VALIDATION_ERROR,
				message: "Please fix the errors below",
				errors: validation.error.flatten().fieldErrors,
				inputs: rawData,
			};
		}

		// Vérifier si la référence existe déjà
		const existingClient = await db.client.findUnique({
			where: { reference: validation.data.reference },
			select: { id: true },
		});

		if (existingClient) {
			return {
				status: ServerActionStatus.ERROR,
				message: "This reference is already taken",
				inputs: rawData,
			};
		}

		// Créer le client
		const client = await db.client.create({
			data: {
				...validation.data,
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
			select: {
				id: true,
				reference: true,
				name: true,
			},
		});

		return {
			status: ServerActionStatus.SUCCESS,
			message: `Client ${client.name} created successfully`,
			data: { id: client.id },
		};
	} catch (error) {
		console.error("Create client error:", error);
		return {
			status: ServerActionStatus.ERROR,
			message:
				error instanceof Error ? error.message : "Failed to create client",
		};
	}
}
