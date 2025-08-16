"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@optima/ui/components/breadcrumb";
// import { UserDropdown } from "@/components/user-dropdown";
// import { SetupMenu } from "@/features/onboarding/views/setup-menu";
import { Separator } from "@optima/ui/components/separator";
import {
	SidebarInset,
	SidebarTrigger,
	useSidebar,
} from "@optima/ui/components/sidebar";
import { Switch } from "@optima/ui/components/switch";
import { cn } from "@optima/ui/lib/utils";
import { useTheme } from "next-themes";

export function DashboardInset({ children }: { children: React.ReactNode }) {
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<SidebarInset>
			<header className="flex h-14.25 bg-sidebar shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear  px-2">
				<SidebarTrigger />
				<div className="flex items-center gap-2 w-full  overflow-x-auto scrollbar-hide">
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-6"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Inbox</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					{/* <JobsBreadcrumb />
					<AccountBreadcrumb />
					<OrganizationBreadcrumb />
					<HomeBreadcrumb /> */}
				</div>
				<div className="flex items-center gap-2">
					<Switch
						checked={resolvedTheme === "dark"}
						onCheckedChange={(checked) => {
							setTheme(checked ? "dark" : "light");
						}}
					/>
				</div>
				{/* <UserDropdown /> */}
			</header>
			<div className="flex flex-1 flex-col p-4">{children}</div>
			{/* <SetupMenu /> */}
		</SidebarInset>
	);
}
