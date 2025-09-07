"use client";

import {
	Building01Icon,
	Calendar03Icon,
	Chatting01Icon,
	Home01Icon,
	JobLinkIcon,
	UserSearch01Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@optima/ui/components/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
} from "@optima/ui/components/sidebar";
import type * as React from "react";
import { HugeIcon } from "@/components/huge-icon";
import { CommandMenu } from "@/features/cmdk/command-menu";
import { Can } from "@/lib/auth/abilities.context";
import { NavMain } from "./nav-main";
import { OrganizationLogo } from "./organization-logo";

export const sidebarLinks = [
	{
		title: "Dashboard",
		url: "/",
		icon: <HugeIcon icon={Home01Icon} />,
		// iconFill: <Icons.HomeFill width={20} height={20} />,
	},
	{
		title: "Calendar",
		url: "/calendar",
		icon: <HugeIcon icon={Calendar03Icon} />,
		// iconFill: <Icons.CalendarFill width={20} height={20} />,
	},
	{
		title: "Jobs",
		url: "/jobs",
		icon: <HugeIcon icon={JobLinkIcon} />,
		// iconFill: <Icons.JobLinkFill width={20} height={20} />,
	},

	{
		title: "Candidates",
		url: "/candidates",
		icon: <HugeIcon icon={UserSearch01Icon} />,
		// iconFill: <Icons.UserSearchFill width={20} height={20} />,
	},
	{
		title: "Messages",
		url: "/messages",
		icon: <HugeIcon icon={Chatting01Icon} />,
		// iconFill: <Icons.MessagesFill width={20} height={20} />,
	},
];
// const communication = [

// ];

export const sidebarSettings = [
	{
		title: "Company",
		url: "/company",
		icon: <HugeIcon icon={Building01Icon} />,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" variant="sidebar" {...props}>
			<SidebarHeader className="p-0 h-14">
				<OrganizationLogo />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<SidebarGroup className="pb-0">
					<SidebarGroupContent className=" p-0">
						<CommandMenu />
					</SidebarGroupContent>
				</SidebarGroup>

				<NavMain items={sidebarLinks} label="Workspace" />
				<Can I="manage" a="organization">
					<NavMain items={sidebarSettings} label="Settings" />
				</Can>
			</SidebarContent>
		</Sidebar>
	);
}
