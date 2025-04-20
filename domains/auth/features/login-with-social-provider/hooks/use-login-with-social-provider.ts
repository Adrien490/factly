"use client";

import { withCallbacks } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { loginWithSocialProvider } from "../actions/login-with-social-provider";

export function useLoginWithSocialProvider() {
	const router = useRouter();
	// Définir un gestionnaire d'erreur simple qui ne dépend pas des propriétés de erro

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(loginWithSocialProvider, {
			onStart: () => {},
			onSuccess: (result) => {
				const url = result.data?.url;

				if (url) {
					router.push(url);
				}
			},
			onError: (error) => {
				console.error("Erreur:", error);
				toast.error("Erreur lors de la connexion au service externe");
			},
		}),
		null
	);

	return { state, dispatch, isPending };
}
