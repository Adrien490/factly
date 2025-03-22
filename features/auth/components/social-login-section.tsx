"use client";

import { Button } from "@/shared/components/ui/button";
import { authClient } from "../lib/auth-client";
import socialProviders from "../lib/social-providers";
import Provider from "../types/provider";

const signIn = async (provider: Provider) => {
	await authClient.signIn.social({
		provider,
		callbackURL: "/dashboard",
	});
};

export default function SocialLoginForm() {
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 gap-3">
				{socialProviders.map((provider) => (
					<Button
						type="button"
						value={provider.id}
						key={provider.id}
						variant="outline"
						size="lg"
						className="w-full bg-background/50 transition-colors duration-200"
						onClick={() => signIn(provider.id as Provider)}
					>
						<div className="flex items-center justify-center w-full">
							<span className="mr-2">{provider.icon}</span>
							<span>Continuer avec {provider.name}</span>
						</div>
					</Button>
				))}
			</div>
		</div>
	);
}
