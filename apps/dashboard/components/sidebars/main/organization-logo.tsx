"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@optima/ui/components/avatar";
import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@optima/ui/components/sidebar";
import { Skeleton } from "@optima/ui/components/skeleton";
import { cn } from "@optima/ui/lib/utils";
// import { useCompany } from "@/hooks/use-company";
import { authClient } from "@/lib/auth/auth.client";

export function OrganizationLogo() {
	const { state, isMobile } = useSidebar();

	const { data: organization } = authClient.useActiveOrganization();

	if (!organization) {
		return (
			<div className={cn("flex items-center gap-2 px-2")}>
				<Skeleton className="size-6 rounded-sm" />
				<Skeleton className="w-full h-6 rounded-sm" />
			</div>
		);
	}
	return (
		<SidebarMenu className={"h-full py-0"}>
			<SidebarMenuItem className="flex items-center gap-2 px-2 py-0 h-full">
				<Avatar className="size-9 rounded-sm">
					<AvatarImage src={organization?.logo ?? ""} className="rounded-sm" />
					<AvatarFallback className="border rounded-sm font-bold text-lg">
						{organization?.name[0]}
						{organization?.name[1]}
					</AvatarFallback>
				</Avatar>
				<span
					className={cn(
						"text-lg font-bold",
						state === "collapsed"
							? "opacity-0  pointer-events-none"
							: "opacity-100  delay-150",
					)}
				>
					{organization?.name}
				</span>
				{/* {(state === "expanded" || (isMobile && state === "collapsed")) && (
				)} */}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
