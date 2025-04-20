"use client";

import { authClient } from "@/domains/auth/lib";
import { Button } from "@/shared/components";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { providers } from "./constants";
import { Provider } from "./types";

export function LoginWithSocialProviderForm() {
	const searchParams = useSearchParams();
	const callbackURL = searchParams.get("callbackURL") || "/dashboard";

	// Fonction simplifiée pour la redirection directe
	const handleLoginWithSocialProvider = async (provider: Provider) => {
		try {
			// Marquer ce provider comme chargement

			// Utiliser directement l'API client plutôt que l'API server
			await authClient.signIn.social({
				provider: provider.id as "google" | "github",
				callbackURL: callbackURL,
			});

			// Note: Cette partie ne sera probablement pas exécutée car la redirection se fera automatiquement
		} catch (error) {
			console.error("Erreur lors de la connexion:", error);
			toast.error(`Erreur lors de la connexion avec ${provider.name}`);
		}
	};

	return (
		<div className="space-y-3 mt-4">
			<div className="grid grid-cols-1 gap-3">
				{providers.map((provider) => (
					<Button
						key={provider.id}
						type="button"
						value={provider.id}
						variant="outline"
						size="lg"
						className="w-full bg-background/50 transition-colors duration-200"
						onClick={() => handleLoginWithSocialProvider(provider)}
					>
						<div className="flex items-center justify-center w-full">
							<span className="mr-2">{provider.icon}</span>
							<span>{`Continuer avec ${provider.name}`}</span>
						</div>
					</Button>
				))}
			</div>
		</div>
	);
}
