import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { loginWithCredentials } from "../actions/login-with-credentials";
export function useLoginWithCredentials() {
	const router = useRouter();
	const [, dispatch, isPending] = useActionState(
		withCallbacks(
			loginWithCredentials,
			createToastCallbacks({
				loadingMessage: "Connexion en cours...",
				onSuccess: () => {
					toast.success("Connexion réussie", {
						description: "Vous allez être redirigé...",
						duration: 3000,
					});
					router.push("/dashboard");
				},
			})
		),
		undefined
	);

	return {
		dispatch,
		isPending,
	};
}
