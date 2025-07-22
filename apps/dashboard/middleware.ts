import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.server";

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
	const session = await auth.api.getSession({
		headers: request.headers,
	});

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
	runtime: "nodejs",
	matcher: [
		// Skip Next.js internals, static files, and auth API routes
		"/((?!_next|api\\/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Match all API routes except auth
		"/api/((?!auth).*)",
	],
};
