"use client";

import { authClient } from "@/domains/auth";
import { Button } from "@/shared/components";
import { Fingerprint, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PasskeyLogin() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handlePasskeyLogin = async () => {
		try {
			setIsLoading(true);
			const data = await authClient.signIn.passkey();
			console.log(data);

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

	useEffect(() => {
		if (
			!PublicKeyCredential.isConditionalMediationAvailable ||
			!PublicKeyCredential.isConditionalMediationAvailable()
		) {
			return;
		}

		void authClient.signIn.passkey({ autoFill: true });
	}, []);

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
