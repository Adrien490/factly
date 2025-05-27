"use client";

import { authClient } from "@/domains/auth";
import { Button } from "@/shared/components";
import { ErrorPage } from "@/shared/components/error-page";
import { ArrowLeftIcon, LockIcon, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ForbiddenPage() {
	const params = useParams();
	const organizationId = params.organizationId as string;
	console.log(organizationId);
	const router = useRouter();

	const handleLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	return (
		<ErrorPage
			icon={<LockIcon className="h-16 w-16 text-amber-500" />}
			title="Accès refusé"
			message="Vous n'avez pas les permissions nécessaires pour accéder à cette page. Pour accéder à cette fonctionnalité, vous devez être membre de l'organisation."
			showHomeButton={false}
			actions={
				<div className="space-y-6">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
						<div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
							<UserPlus className="h-5 w-5" />
							Demander l&apos;accès
						</div>
						<p className="text-sm text-blue-600">
							Contactez l&apos;administrateur pour qu&apos;il vous ajoute en
							tant que membre.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3 items-center">
						<Button asChild variant="outline">
							<Link
								href={`/dashboard/${organizationId}`}
								className="flex items-center gap-2"
							>
								<ArrowLeftIcon className="h-4 w-4" />
								Retour au tableau de bord
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link
								href="mailto:admin@example.com?subject=Demande d'accès à l'organisation&body=Bonjour,%0D%0A%0D%0AJe souhaiterais obtenir l'accès à l'organisation en tant que membre.%0D%0A%0D%0AMerci."
								className="flex items-center gap-2"
							>
								<Mail className="h-4 w-4" />
								Contacter l&apos;administrateur
							</Link>
						</Button>
						<Button onClick={handleLogout}>Se déconnecter</Button>
					</div>
				</div>
			}
		/>
	);
}
