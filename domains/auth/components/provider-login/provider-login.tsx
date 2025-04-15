"use client";

import { Button } from "@/shared/components/ui/button";
import { providers } from "./constants";
import { signIn } from "./utils";

export function ProviderLogin() {
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 gap-3">
				{providers.map((provider) => (
					<Button
						type="button"
						value={provider.id}
						key={provider.id}
						variant="outline"
						size="lg"
						className="w-full bg-background/50 transition-colors duration-200"
						onClick={() => signIn(provider.id)}
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
