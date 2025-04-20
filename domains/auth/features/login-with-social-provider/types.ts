export type Provider = "google" | "github";

export interface SocialAuthResponse {
	url?: string;
	redirect?: boolean;
	token?: string;
	user?: {
		id: string;
		email: string;
		name: string;
		image?: string | null;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
}
