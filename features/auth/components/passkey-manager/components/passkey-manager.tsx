"use client";

import { authClient } from "@/features/auth/lib/auth-client";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Fingerprint,
	KeyRound,
	Loader2,
	ShieldCheck,
	Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PasskeyManager() {
	const [isAddingPasskey, setIsAddingPasskey] = useState(false);
	const [isAddingCrossDevice, setIsAddingCrossDevice] = useState(false);

	const handleAddPasskey = async () => {
		try {
			setIsAddingPasskey(true);
			const result = await authClient.passkey.addPasskey();

			if (result?.error) {
				console.error("Erreur lors de l'ajout du passkey:", result.error);
				toast.error("Erreur", {
					description: "Impossible d'ajouter le passkey.",
					icon: <Fingerprint className="h-5 w-5 text-destructive" />,
					position: "top-center",
				});
				return;
			}

			toast.success("Passkey ajouté", {
				description: "Votre passkey a été ajouté avec succès.",
				icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
				position: "top-center",
			});
		} catch (error) {
			console.error("Erreur lors de l'ajout du passkey:", error);
			toast.error("Erreur", {
				description: "Une erreur est survenue lors de l'ajout du passkey.",
				icon: <Fingerprint className="h-5 w-5 text-destructive" />,
				position: "top-center",
			});
		} finally {
			setIsAddingPasskey(false);
		}
	};

	const handleAddCrossDevicePasskey = async () => {
		try {
			setIsAddingCrossDevice(true);
			const result = await authClient.passkey.addPasskey({
				authenticatorAttachment: "cross-platform",
			});

			if (result?.error) {
				console.error("Erreur lors de l'ajout du passkey:", result.error);
				toast.error("Erreur", {
					description: "Impossible d'ajouter la clé de sécurité.",
					icon: <KeyRound className="h-5 w-5 text-destructive" />,
					position: "top-center",
				});
				return;
			}

			toast.success("Clé de sécurité ajoutée", {
				description: "Votre clé de sécurité a été ajoutée avec succès.",
				icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
				position: "top-center",
			});
		} catch (error) {
			console.error("Erreur lors de l'ajout de la clé:", error);
			toast.error("Erreur", {
				description:
					"Une erreur est survenue lors de l'ajout de la clé de sécurité.",
				icon: <KeyRound className="h-5 w-5 text-destructive" />,
				position: "top-center",
			});
		} finally {
			setIsAddingCrossDevice(false);
		}
	};

	return (
		<Card className="border-border/10 bg-background/95 backdrop-blur-xs">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShieldCheck className="h-5 w-5 text-primary" />
					Passkeys
				</CardTitle>
				<CardDescription>
					Connectez-vous sans mot de passe en utilisant la biométrie ou des clés
					de sécurité.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button
						onClick={handleAddPasskey}
						disabled={isAddingPasskey || isAddingCrossDevice}
						className="flex items-center justify-center gap-2 group"
					>
						{isAddingPasskey ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Smartphone className="h-4 w-4 group-hover:text-white/90" />
						)}
						<span>
							{isAddingPasskey
								? "Ajout en cours..."
								: "Ajouter un passkey (cet appareil)"}
						</span>
					</Button>

					<Button
						onClick={handleAddCrossDevicePasskey}
						disabled={isAddingPasskey || isAddingCrossDevice}
						variant="outline"
						className="flex items-center justify-center gap-2 group"
					>
						{isAddingCrossDevice ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<KeyRound className="h-4 w-4 text-primary group-hover:text-primary/80" />
						)}
						<span>
							{isAddingCrossDevice
								? "Ajout en cours..."
								: "Ajouter une clé de sécurité"}
						</span>
					</Button>
				</div>

				<div className="text-sm text-muted-foreground rounded-md">
					<p className="flex items-start gap-2 mt-4">
						<ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
						<span>
							Les passkeys vous permettent de vous connecter de manière
							sécurisée sans mot de passe, en utilisant votre empreinte
							digitale, la reconnaissance faciale ou une clé de sécurité
							physique.
						</span>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
