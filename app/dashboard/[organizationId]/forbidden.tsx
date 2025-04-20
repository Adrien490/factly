"use client";

import { Button } from "@/shared/components";
import { ErrorPage } from "@/shared/components/error-page";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ForbiddenPage() {
	const params = useParams();
	const organizationId = params.organizationId as string;
	console.log(organizationId);

	return (
		<ErrorPage
			icon={<LockIcon className="h-16 w-16 text-amber-500" />}
			title="Accès refusé"
			message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
			showHomeButton={false}
			actions={
				<>
					<Button asChild variant="outline">
						<Link
							href={`/dashboard/${organizationId}`}
							className="flex items-center gap-2"
						>
							<ArrowLeftIcon className="h-4 w-4" />
							Retour au tableau de bord
						</Link>
					</Button>
					<Button asChild>
						<Link href="/" className="flex items-center gap-2">
							Accueil
						</Link>
					</Button>
				</>
			}
		/>
	);
}
