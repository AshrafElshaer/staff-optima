"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@optima/ui/components/breadcrumb";

import { Separator } from "@optima/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@optima/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { CompanyBreadcrumb } from "../breadcrumbs/company-breadcrumb";
import { UserDropdown } from "../user-dropdown";

export function DashboardInset({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDashboard = pathname === "/";
	return (
		<SidebarInset>
			<header className="flex h-14.25 bg-sidebar shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear  px-2">
				<SidebarTrigger />
				<div className="flex items-center gap-2 w-full  overflow-x-auto scrollbar-hide">
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-6"
					/>
					{isDashboard && (
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
					)}
					<CompanyBreadcrumb />
					{/* <JobsBreadcrumb />
					<AccountBreadcrumb />
					<OrganizationBreadcrumb />

					<HomeBreadcrumb /> */}
				</div>

				<UserDropdown />
			</header>
			<div className="flex flex-1 flex-col">{children}</div>
		</SidebarInset>
	);
}
