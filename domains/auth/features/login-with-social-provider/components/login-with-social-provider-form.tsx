"use client";

import { Button } from "@/shared/components";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { providers } from "../constants";
import { useLoginWithSocialProvider } from "../hooks/use-login-with-social-provider";

export function LoginWithSocialProviderForm() {
	const searchParams = useSearchParams();
	const callbackURL = searchParams.get("callbackURL") || "/dashboard";
	const [isPending, startTransition] = useTransition();
	const { dispatch } = useLoginWithSocialProvider();

	// Fonction simplifiée pour la redirection directe
	const handleLoginWithSocialProvider = async (
		provider: (typeof providers)[number]
	) => {
		const formData = new FormData();
		formData.append("provider", provider.id);
		formData.append("callbackURL", callbackURL);

		startTransition(async () => {
			dispatch(formData);
		});
	};

	return (
		<div className="space-y-3 mt-4">
			<div className="grid grid-cols-1 gap-3">
				{providers.map((provider) => (
					<Button
						disabled={isPending}
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
