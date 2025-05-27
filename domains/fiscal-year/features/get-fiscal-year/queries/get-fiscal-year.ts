"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getFiscalYearSchema } from "../schemas";

/**
 * Récupère les détails d'une année fiscale spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getFiscalYear(params: { id: string }) {
	// 1. Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect("/auth/signin");
	}

	// 2. Validation des paramètres
	const validation = getFiscalYearSchema.safeParse(params);
	if (!validation.success) {
		notFound();
	}

	// 3. Récupération de l'année fiscale
	const fiscalYear = await db.fiscalYear.findUnique({
		where: { id: validation.data.id },
	});

	if (!fiscalYear) {
		return null;
	}

	return fiscalYear;
}
