import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.server";

const publicRoutes = ["/auth", "/api/auth"];
function isPublicRoute(pathname: string) {
	return publicRoutes.includes(pathname);
}
export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session && !isPublicRoute(pathname)) {
		return NextResponse.redirect(
			new URL(`/auth?redirect=${pathname}`, request.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
