import { betterFetch } from "@better-fetch/fetch";
import { Session } from "inspector";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/signin"];
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

	if (publicApiRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
		return NextResponse.next();
	}

	if (
		isLoggedIn &&
		publicOnlyRoutes.some((route) => nextUrl.pathname.startsWith(route))
	) {
		return Response.redirect(new URL("/dashboard", nextUrl.origin));
	}

	if (
		!isLoggedIn &&
		protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))
	) {
		const redirectUrl = new URL("/signin", nextUrl.origin);
		redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
		return Response.redirect(redirectUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/signin", "/api"], // Apply middleware to specific routes
};
