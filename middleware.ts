import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./domains/auth/lib/auth";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/login"];
const publicApiRoutes = ["/api"];

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
		const redirectUrl = new URL("/login", nextUrl.origin);
		redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
		return Response.redirect(redirectUrl);
	}

	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
	matcher: ["/dashboard", "/login", "/api"], // Apply middleware to specific routes
};
