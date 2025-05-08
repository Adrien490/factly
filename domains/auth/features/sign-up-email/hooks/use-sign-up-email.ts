import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { signUpEmail } from "../actions/sign-up-email";

export function useSignUpEmail() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			signUpEmail,
			createToastCallbacks({
				loadingMessage: "Inscription en cours...",
				onSuccess: () => {
					toast.success("Inscription réussie", {
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
		state,
		dispatch,
		isPending,
	};
}
