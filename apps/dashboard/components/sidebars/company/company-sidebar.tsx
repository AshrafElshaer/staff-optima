"use client";

import {
	CreditCardIcon,
	DashboardSquare03Icon,
	FingerPrintIcon,
	MailAdd02Icon,
	Profile02Icon,
	SlidersHorizontalIcon,
	WorkflowSquare10Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@optima/ui/components/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenuItem,
	useSidebar,
} from "@optima/ui/components/sidebar";
import { cn } from "@optima/ui/lib/utils";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { HugeIcon } from "@/components/huge-icon";

import { NavMain } from "../main/nav-main";

const general = [
	{
		title: "Public Profile",
		url: "/company",
		icon: <HugeIcon icon={Profile02Icon} />,
		iconFill: <HugeIcon icon={Profile02Icon} />,
	},
	{
		title: "Departments",
		url: "/company/departments",
		icon: <HugeIcon icon={DashboardSquare03Icon} />,
		iconFill: <HugeIcon icon={DashboardSquare03Icon} />,
	},
	{
		title: "Roles & Permission",
		url: "/company/access-control",
		icon: <HugeIcon icon={FingerPrintIcon} />,
		iconFill: <HugeIcon icon={FingerPrintIcon} />,
	},
	{
		title: "Integrations",
		url: "/company/integrations",
		icon: <HugeIcon icon={SlidersHorizontalIcon} />,
		iconFill: <HugeIcon icon={SlidersHorizontalIcon} />,
	},
	{
		title: "Billing & Usage",
		url: "/company/billing",
		icon: <HugeIcon icon={CreditCardIcon} />,
		iconFill: <HugeIcon icon={CreditCardIcon} />,
	},
];
const applications = [
	{
		title: "Workflows",
		url: "/company/workflows",
		icon: <HugeIcon icon={WorkflowSquare10Icon} />,
		iconFill: <HugeIcon icon={WorkflowSquare10Icon} />,
	},
];

const communication = [
	// {
	//   title: "Chat Channels",
	//   url: "/organization/chat-channels",
	//   icon: <FaHashtag strokeWidth={1} className="size-[20px]" />,
	// },
	{
		title: "Email Templates",
		url: "/company/email-templates",
		icon: <HugeIcon icon={MailAdd02Icon} />,
		iconFill: <HugeIcon icon={MailAdd02Icon} />,
	},
];
export function CompanySidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const { state, setOpenMobile } = useSidebar();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenuItem className={cn("flex items-center gap-2 px-2 h-10")}>
					<button
						type="button"
						className="cursor-pointer"
						onClick={() => {
							router.push("/");
							setOpenMobile(false);
						}}
					>
						<HiArrowUturnLeft strokeWidth={2} size={14} />
						<span className="sr-only">Back</span>
					</button>
					<span className={cn(" font-bold", state === "collapsed" && "hidden")}>
						Settings
					</span>
				</SidebarMenuItem>
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<NavMain items={general} label="General" />
				<NavMain items={applications} label="Applications" />
				<NavMain items={communication} label="Communication" />
			</SidebarContent>
			<Separator />
		</Sidebar>
	);
}
