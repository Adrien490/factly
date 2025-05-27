"use client";

import { authClient } from "@/domains/auth/lib/auth-client";
import { RefreshMembershipButton } from "@/domains/member/features/refresh-membership/components/refresh-membership-button";
import { Button } from "@/shared/components";
import { ErrorPage } from "@/shared/components/error-page";
import { LockIcon, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
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
			icon={<LockIcon className="h-16 w-16 text-red-500" />}
			title="Accès refusé"
			message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
			showHomeButton={false}
			actions={
				<div className="space-y-6">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
						<div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
							<UserPlus className="h-5 w-5" />
							Demander l&apos;accès
						</div>
						<p className="text-sm text-blue-700 mb-3">
							Pour accéder à cette fonctionnalité, vous devez être membre de
							l&apos;organisation.
						</p>
						<p className="text-sm text-blue-600">
							Contactez l&apos;administrateur pour qu&apos;il vous ajoute en
							tant que membre.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
						<RefreshMembershipButton />
						<Button onClick={handleLogout} variant="destructive">
							Se déconnecter
						</Button>
					</div>
				</div>
			}
		/>
	);
}
