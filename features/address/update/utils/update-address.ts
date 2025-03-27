"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import db from "@/features/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { updateAddressSchema } from "../schemas";
import { UpdateAddressReturn } from "../types";

/**
 * Met à jour une adresse existante
 */
export async function updateAddress(
	params: z.infer<typeof updateAddressSchema>
): Promise<UpdateAddressReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = updateAddressSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Récupérer l'adresse existante
		const existingAddress = await db.address.findUnique({
			where: { id: validatedParams.id },
			select: {
				...DEFAULT_SELECT,
				client: { select: { organizationId: true } },
				supplier: { select: { organizationId: true } },
			},
		});

		if (!existingAddress) {
			throw new Error("Address not found");
		}

		// Vérifier les droits d'accès à l'organisation
		const organizationId =
			existingAddress.client?.organizationId ||
			existingAddress.supplier?.organizationId;

		if (!organizationId) {
			throw new Error("Address is not associated with any organization");
		}

		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Extraire les données à mettre à jour (et supprimer l'ID)
		const { id, ...dataToUpdate } = validatedParams;

		// Si l'adresse est définie comme adresse par défaut, il faut mettre à jour
		// les autres adresses du même client/fournisseur
		if (dataToUpdate.isDefault === true) {
			if (existingAddress.clientId) {
				await db.address.updateMany({
					where: {
						clientId: existingAddress.clientId,
						isDefault: true,
						id: { not: id },
					},
					data: { isDefault: false },
				});
			} else if (existingAddress.supplierId) {
				await db.address.updateMany({
					where: {
						supplierId: existingAddress.supplierId,
						isDefault: true,
						id: { not: id },
					},
					data: { isDefault: false },
				});
			}
		}

		// Mettre à jour l'adresse
		const updatedAddress = await db.address.update({
			where: { id },
			data: dataToUpdate,
			select: DEFAULT_SELECT,
		});

		return updatedAddress;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
