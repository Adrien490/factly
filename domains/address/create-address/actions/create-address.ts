"use server";

import { auth } from "@/domains/auth/lib/auth";
import { hasOrganizationAccess } from "@/domains/organization";
import db from "@/shared/lib/db";
import { ServerActionState } from "@/shared/types";
import { Address } from "cluster";
import { headers } from "next/headers";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { createAddressSchema } from "../schemas";
import { CreateAddressReturn } from "../types";
/**
 * Crée une nouvelle adresse pour un client ou un fournisseur
 */
export async function createAddress(
	_: ServerActionState<Address, typeof createAddressSchema>,
	formData: FormData
): Promise<CreateAddressReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const rawData = {
			addressLine1: formData.get("addressLine1"),
			addressLine2: formData.get("addressLine2"),
			postalCode: formData.get("postalCode"),
			city: formData.get("city"),
			country: formData.get("country"),
			isDefault: formData.get("isDefault"),
			clientId: formData.get("clientId"),
			supplierId: formData.get("supplierId"),
		};

		// Validation des paramètres
		const validation = createAddressSchema.safeParse(rawData);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Vérifier si l'utilisateur a accès à l'organisation associée
		let organizationId: string | null = null;

		if (validatedParams.clientId) {
			const client = await db.client.findUnique({
				where: { id: validatedParams.clientId },
				select: { organizationId: true },
			});

			if (!client) {
				throw new Error("Client not found");
			}

			organizationId = client.organizationId;
		} else if (validatedParams.supplierId) {
			const supplier = await db.supplier.findUnique({
				where: { id: validatedParams.supplierId },
				select: { organizationId: true },
			});

			if (!supplier) {
				throw new Error("Supplier not found");
			}

			organizationId = supplier.organizationId;
		}

		if (!organizationId) {
			throw new Error("Missing organization reference");
		}

		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Si la nouvelle adresse est définie comme adresse par défaut, il faut mettre à jour
		// les autres adresses du même client/fournisseur
		if (validatedParams.isDefault) {
			if (validatedParams.clientId) {
				await db.address.updateMany({
					where: {
						clientId: validatedParams.clientId,
						isDefault: true,
					},
					data: { isDefault: false },
				});
			} else if (validatedParams.supplierId) {
				await db.address.updateMany({
					where: {
						supplierId: validatedParams.supplierId,
						isDefault: true,
					},
					data: { isDefault: false },
				});
			}
		}

		// Créer l'adresse
		const newAddress = await db.address.create({
			data: validatedParams,
			select: DEFAULT_SELECT,
		});

		return newAddress;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
