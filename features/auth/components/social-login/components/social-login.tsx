"use client";

import socialProviders from "@/features/auth/constants/social-providers";
import Provider from "@/features/auth/types/provider";
import { signIn } from "@/features/auth/utils";
import { Button } from "@/features/shared/components/ui/button";

export function SocialLogin() {
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
