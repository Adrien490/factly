"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/lib/types/server-action";

export default async function deleteClient(
	_: ServerActionState | null,
	formData: FormData
): Promise<ServerActionState> {
	try {
		const session = await auth();

		if (!session?.user) {
			return {
				status: ServerActionStatus.UNAUTHORIZED,
				message: "Non autorisé",
			};
		}

		const id = formData.get("id") as string;

		if (!id) {
			return {
				status: ServerActionStatus.ERROR,
				message: "ID du client manquant",
			};
		}

		const client = await db.client.findUnique({
			where: {
				id,
				userId: session.user.id,
			},
			select: {
				id: true,
				name: true,
			},
		});

		if (!client) {
			return {
				status: ServerActionStatus.ERROR,
				message: "Client introuvable",
			};
		}

		await db.client.delete({
			where: {
				id,
				userId: session.user.id,
			},
		});

		return {
			status: ServerActionStatus.SUCCESS,
			message: `Client ${client.name} supprimé avec succès`,
		};
	} catch (error: unknown) {
		return {
			status: ServerActionStatus.ERROR,
			message: error instanceof Error ? error.message : "Erreur inconnue",
		};
	}
}
