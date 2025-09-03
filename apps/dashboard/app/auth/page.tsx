import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthComponent } from "@/features/auth/views";

export const metadata: Metadata = {
	title: "Authentication",
};

export default function AuthPage() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-background">
			<Suspense>
				<AuthComponent />
			</Suspense>
		</div>
	);
}
