import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes qui nécessitent une authentification
const protectedRoutes = ["/dashboard", "/settings", "/api/files"];

// Routes accessibles uniquement aux visiteurs (non connectés)
const publicOnlyRoutes = ["/login"];

// Routes API qui doivent toujours être accessibles
const publicApiRoutes = ["/api/webhook/stripe"];

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// Toujours autoriser les webhooks et autres routes API publiques
	if (publicApiRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
		return NextResponse.next();
	}

	// Rediriger les utilisateurs connectés vers /workspaces s'ils tentent d'accéder aux pages de connexion
	if (
		isLoggedIn &&
		publicOnlyRoutes.some((route) => nextUrl.pathname.startsWith(route))
	) {
		return Response.redirect(new URL("/dashboard", nextUrl.origin));
	}

	// Rediriger les utilisateurs non connectés vers la page de connexion pour les routes protégées
	if (
		!isLoggedIn &&
		protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))
	) {
		const redirectUrl = new URL("/login", nextUrl.origin);
		redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
		return Response.redirect(redirectUrl);
	}

	return NextResponse.next();
});

// Configurer les chemins sur lesquels le middleware s'applique
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
