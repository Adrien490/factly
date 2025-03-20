import type { BetterAuthPlugin } from "better-auth";

export function createUserPlugin(): BetterAuthPlugin {
	return {
		id: "user-creation",
		hooks: {
			after: [
				{
					matcher: () => true,
					handler: async (context) => {
						return context;
					},
				},
			],
		},
	};
}
