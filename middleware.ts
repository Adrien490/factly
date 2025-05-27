import { betterFetch } from "@better-fetch/fetch";
import { Session } from "inspector";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/"];
const publicApiRoutes = ["/api"];

export async function middleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
			},
		}
	);

	const { nextUrl } = request;
	const isLoggedIn = !!session;

	// Allow API routes to pass through
	if (publicApiRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
		return NextResponse.next();
	}

	// Redirect logged-in users from public-only routes to dashboard
	if (
		isLoggedIn &&
		publicOnlyRoutes.some((route) => nextUrl.pathname === route)
	) {
		return Response.redirect(new URL("/dashboard", nextUrl.origin));
	}

	// Redirect non-logged-in users from protected routes to home
	if (
		!isLoggedIn &&
		protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))
	) {
		const redirectUrl = new URL("/", nextUrl.origin);
		redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
		return Response.redirect(redirectUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - dashboard (protected routes)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|dashboard).*)",
	],
};
