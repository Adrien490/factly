"use client";

import { authClient } from "@/features/auth/lib/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Fingerprint, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PasskeyLogin() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Préchargement des passkeys pour l'UI conditionnelle
	useEffect(() => {
		// Vérification correcte et sécurisée de l'API WebAuthn
		if (
			typeof window === "undefined" ||
			typeof PublicKeyCredential === "undefined" ||
			typeof PublicKeyCredential.isConditionalMediationAvailable !==
				"function" ||
			!PublicKeyCredential.isConditionalMediationAvailable()
		) {
			console.log(
				"L'authentification conditionnelle par passkey n'est pas supportée"
			);
			return;
		}

		// Préchargement des passkeys avec gestion d'erreur
		authClient.signIn.passkey({ autoFill: true }).catch((error) => {
			console.warn("Erreur lors du préchargement des passkeys:", error);
		});
	}, []);

	const handlePasskeyLogin = async () => {
		try {
			setIsLoading(true);
			await authClient.signIn.passkey();

			// Animation de transition avant redirection
			toast.success("Connexion réussie", {
				description: "Redirection vers votre espace...",
				icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
				position: "top-center",
			});

			// Redirection vers le tableau de bord après un court délai
			setTimeout(() => {
				router.push("/dashboard");
			}, 500);
		} catch (error) {
			console.error("Erreur d'authentification par passkey:", error);
			toast.error("Échec de connexion", {
				description: "La connexion par passkey a échoué. Veuillez réessayer.",
				icon: <Fingerprint className="h-5 w-5 text-destructive" />,
				position: "top-center",
			});
			setIsLoading(false);
		}
	};

	return (
		<Button
			type="button"
			onClick={handlePasskeyLogin}
			disabled={isLoading}
			variant="outline"
			size="lg"
			className="w-full"
		>
			<span className="flex items-center justify-center w-full">
				{isLoading ? (
					<Loader2 className="w-4 h-4 mr-2 animate-spin" />
				) : (
					<Fingerprint className="mr-2 w-4 h-4 text-primary group-hover:text-primary/80" />
				)}
				<span>
					{isLoading ? "Connexion en cours..." : "Continuer avec Passkey"}
				</span>
			</span>
		</Button>
	);
}
