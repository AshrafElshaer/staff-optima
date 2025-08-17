"use client";

import { SidebarProvider } from "@optima/ui/components/sidebar";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { CompanySidebar } from "@/components/sidebars/company/company-sidebar";
import { DashboardInset } from "@/components/sidebars/dashboard-inset";
import { AppSidebar } from "@/components/sidebars/main/app-sidebar";
import { AbilityContext, createAbility } from "@/lib/auth/abilities";
import { authClient } from "@/lib/auth/auth.client";

export default function PlatformLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isCompany = pathname.startsWith("/company");
	const { data: session } = authClient.useSession();

	const userAbilities = useMemo(() => {
		return createAbility(JSON.parse(session?.session.permissions || "[]"));
	}, [session]);

	return (
		<AbilityContext.Provider value={userAbilities}>
			<SidebarProvider>
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={isCompany ? "company" : "app"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						{isCompany ? <CompanySidebar /> : <AppSidebar />}
					</motion.div>
				</AnimatePresence>
				<DashboardInset>{children}</DashboardInset>
			</SidebarProvider>
		</AbilityContext.Provider>
	);
}
