import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";
import type { Session } from "./lib/auth/auth.client";

const publicRoutes = ["/auth", "/api/auth"];
const onboardingRoutes = ["/onboarding"];

function isPublicRoute(pathname: string) {
	return publicRoutes.some((route) => pathname.startsWith(route));
}

function isOnboardingRoute(pathname: string) {
	return onboardingRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
			},
		},
	);
	// If no session and not on a public route, redirect to auth
	if (!session && !isPublicRoute(pathname)) {
		return NextResponse.redirect(
			new URL(`/auth?redirectUrl=${pathname}`, request.url),
		);
	}

	// If session exists but no active organization and not on onboarding or public routes
	if (
		!session?.session?.activeOrganizationId &&
		!isPublicRoute(pathname) &&
		!isOnboardingRoute(pathname)
	) {
		return NextResponse.redirect(new URL(`/onboarding`, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip Next.js internals, static files, and auth API routes
		"/((?!_next|api\\/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Match all API routes except auth
		"/api/((?!auth).*)",
	],
};
