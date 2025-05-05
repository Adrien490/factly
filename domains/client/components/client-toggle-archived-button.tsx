"use client";

import { Button } from "@/shared/components";
import { ClientStatus } from "@prisma/client";
import { Archive, Undo } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export function ClientToggleArchivedButton() {
	const router = useRouter();
	const params = useParams();
	const organizationId = params.organizationId as string;
	const searchParams = useSearchParams();

	const isArchivedView = searchParams.get("status") === ClientStatus.ARCHIVED;

	const handleToggleArchived = () => {
		// Créer un nouvel objet URLSearchParams basé sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		if (isArchivedView) {
			// Si on est en vue archivée, on retire le filtre de statut
			params.delete("status");
		} else {
			// Sinon, on ajoute le filtre pour voir les clients archivés
			params.set("status", ClientStatus.ARCHIVED);
		}

		// Rediriger vers la nouvelle URL
		router.push(`/dashboard/${organizationId}/clients?${params.toString()}`);
	};

	return (
		<Button
			variant={isArchivedView ? "default" : "outline"}
			onClick={handleToggleArchived}
			className="shrink-0 relative w-[200px]"
		>
			{isArchivedView ? (
				<>
					<Undo className="mr-2 h-4 w-4" />
					<span>Voir tous les clients</span>
				</>
			) : (
				<>
					<Archive className="mr-2 h-4 w-4" />
					<span>Voir les clients archivés</span>
				</>
			)}
		</Button>
	);
}
