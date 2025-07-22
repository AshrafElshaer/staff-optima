import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.server";

const publicRoutes = ["/auth", "/api/auth"];
function isPublicRoute(pathname: string) {
	return publicRoutes.some((route) => pathname.startsWith(route));
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

	console.dir({ session }, { depth: null });

	if (!session && !isPublicRoute(pathname)) {
		return NextResponse.redirect(
			new URL(`/auth?redirectUrl=${pathname}`, request.url),
		);
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
