"use client";

import {
	Building01Icon,
	Calendar03Icon,
	Chatting01Icon,
	Home01Icon,
	JobLinkIcon,
	UserSearch01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "@optima/ui/components/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@optima/ui/components/sidebar";
import type * as React from "react";
import { NavMain } from "./nav-main";
import { OrganizationLogo } from "./organization-logo";

export const sidebarLinks = [
	{
		title: "Dashboard",
		url: "/",
		icon: <HugeiconsIcon icon={Home01Icon} />,
		// iconFill: <Icons.HomeFill width={20} height={20} />,
	},
	{
		title: "Calendar",
		url: "/calendar",
		icon: <HugeiconsIcon icon={Calendar03Icon} />,
		// iconFill: <Icons.CalendarFill width={20} height={20} />,
	},
	{
		title: "Jobs",
		url: "/jobs",
		icon: <HugeiconsIcon icon={JobLinkIcon} />,
		// iconFill: <Icons.JobLinkFill width={20} height={20} />,
	},

	{
		title: "Candidates",
		url: "/candidates",
		icon: <HugeiconsIcon icon={UserSearch01Icon} />,
		// iconFill: <Icons.UserSearchFill width={20} height={20} />,
	},
	{
		title: "Messages",
		url: "/messages",
		icon: <HugeiconsIcon icon={Chatting01Icon} />,
		// iconFill: <Icons.MessagesFill width={20} height={20} />,
	},
];
// const communication = [

// ];

export const sidebarSettings = [
	{
		title: "Company",
		url: "/company",
		icon: <HugeiconsIcon icon={Building01Icon} />,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// const { data: userRole } = useUserRole();
	// const hasCompanyPermission = hasPermission(userRole?.permissions ?? [], [
	// 	"settings:company",
	// 	"settings:template",
	// 	"settings:workflow",
	// 	"settings:integration",
	// 	"user:add",
	// 	"user:update",
	// 	"user:delete",
	// ]);
	return (
		<Sidebar collapsible="icon" variant="sidebar" {...props}>
			<SidebarHeader className="p-0 h-14">
				<OrganizationLogo />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<NavMain items={sidebarLinks} label="Workspace" />
				{/* <NavMain items={communication} label="Communication" /> */}
				<NavMain items={sidebarSettings} label="Settings" />
				{/* {hasCompanyPermission ? (
				) : null} */}
			</SidebarContent>
		</Sidebar>
	);
}
