"use client";

import { SidebarProvider } from "@optima/ui/components/sidebar";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { DashboardInset } from "@/components/sidebars/dashboard-inset";
import { AppSidebar } from "@/components/sidebars/main/app-sidebar";

export default function PlatformLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isCompany = pathname.startsWith("/company");
	return (
		<SidebarProvider>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={isCompany ? "company" : "app"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					<AppSidebar />
				</motion.div>
			</AnimatePresence>
			<DashboardInset>{children}</DashboardInset>
		</SidebarProvider>
	);
}
