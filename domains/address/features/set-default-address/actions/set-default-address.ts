"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../../constants";
import { setDefaultAddressSchema } from "../schemas";
import { SetDefaultAddressReturn } from "../types";

/**
 * Définit une adresse comme adresse par défaut
 */
export async function setDefaultAddress(
	params: z.infer<typeof setDefaultAddressSchema>
): Promise<SetDefaultAddressReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = setDefaultAddressSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(
			validatedParams.organizationId
		);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Récupérer l'adresse existante
		const existingAddress = await db.address.findUnique({
			where: { id: validatedParams.id },
			select: {
				...DEFAULT_SELECT,
				addressType: true,
				client: { select: { organizationId: true } },
				supplier: { select: { organizationId: true } },
			},
		});

		if (!existingAddress) {
			throw new Error("Address not found");
		}

		// Vérifier que l'adresse appartient bien à l'organisation spécifiée
		const addressOrganizationId =
			existingAddress.client?.organizationId ||
			existingAddress.supplier?.organizationId;

		if (!addressOrganizationId) {
			throw new Error("Address is not associated with any organization");
		}

		if (addressOrganizationId !== validatedParams.organizationId) {
			throw new Error("Address does not belong to the specified organization");
		}

		// Réinitialiser le statut par défaut pour toutes les autres adresses du même type
		// appartenant au même client/fournisseur
		if (existingAddress.clientId) {
			await db.address.updateMany({
				where: {
					clientId: existingAddress.clientId,
					addressType: existingAddress.addressType,
					isDefault: true,
					id: { not: validatedParams.id },
				},
				data: { isDefault: false },
			});
		} else if (existingAddress.supplierId) {
			await db.address.updateMany({
				where: {
					supplierId: existingAddress.supplierId,
					addressType: existingAddress.addressType,
					isDefault: true,
					id: { not: validatedParams.id },
				},
				data: { isDefault: false },
			});
		}

		// Définir l'adresse sélectionnée comme adresse par défaut
		const updatedAddress = await db.address.update({
			where: { id: validatedParams.id },
			data: { isDefault: true },
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
