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
import { useMemo } from "react";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { HugeIcon } from "@/components/huge-icon";
import { useAbility } from "@/hooks/use-ability";
import { NavMain } from "../main/nav-main";
import type { ActionType, SubjectType } from "@/lib/auth/abilities";

type Route = {
	title: string;
	url: string;
	icon: React.ReactNode;
	iconFill: React.ReactNode;
	permission: { action: ActionType; subject: SubjectType };
};
const general: Route[] = [
	{
		title: "Public Profile",
		url: "/company",
		icon: <HugeIcon icon={Profile02Icon} />,
		iconFill: <HugeIcon icon={Profile02Icon} />,
		permission: { action: "manage", subject: "organization" },
	},
	{
		title: "Departments",
		url: "/company/departments",
		icon: <HugeIcon icon={DashboardSquare03Icon} />,
		iconFill: <HugeIcon icon={DashboardSquare03Icon} />,
		permission: { action: "manage", subject: "team" },
	},
	{
		title: "Roles & Permission",
		url: "/company/access-control",
		icon: <HugeIcon icon={FingerPrintIcon} />,
		iconFill: <HugeIcon icon={FingerPrintIcon} />,
		permission: { action: "role:assign", subject: "user" },
	},
	{
		title: "Integrations",
		url: "/company/integrations",
		icon: <HugeIcon icon={SlidersHorizontalIcon} />,
		iconFill: <HugeIcon icon={SlidersHorizontalIcon} />,
		permission: { action: "manage", subject: "integration" },
	},
	{
		title: "Billing & Usage",
		url: "/company/billing",
		icon: <HugeIcon icon={CreditCardIcon} />,
		iconFill: <HugeIcon icon={CreditCardIcon} />,
		permission: { action: "manage", subject: "billing" },
	},
];
const applications: Route[] = [
	{
		title: "Stages & Workflows",
		url: "/company/stages-workflows",
		icon: <HugeIcon icon={WorkflowSquare10Icon} />,
		iconFill: <HugeIcon icon={WorkflowSquare10Icon} />,
		permission: { action: "configure", subject: "pipeline" },
	},
];

const communication: Route[] = [
	{
		title: "Email Templates",
		url: "/company/email-templates",
		icon: <HugeIcon icon={MailAdd02Icon} />,
		iconFill: <HugeIcon icon={MailAdd02Icon} />,
		permission: { action: "update", subject: "settings" },
	},
];
export function CompanySidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const { state, setOpenMobile } = useSidebar();
	const ability = useAbility();

	// Filter items based on user abilities
	const filteredGeneral = useMemo(
		() =>
			general.filter((item) =>
				ability.can(item.permission.action, item.permission.subject),
			),
		[ability],
	);

	const filteredApplications = useMemo(
		() =>
			applications.filter((item) =>
				ability.can(item.permission.action, item.permission.subject),
			),
		[ability],
	);

	const filteredCommunication = useMemo(
		() =>
			communication.filter((item) =>
				ability.can(item.permission.action, item.permission.subject),
			),
		[ability],
	);

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
				{filteredGeneral.length > 0 && (
					<NavMain items={filteredGeneral} label="General" />
				)}
				{filteredApplications.length > 0 && (
					<NavMain items={filteredApplications} label="Applications" />
				)}
				{filteredCommunication.length > 0 && (
					<NavMain items={filteredCommunication} label="Communication" />
				)}
			</SidebarContent>
			<Separator />
		</Sidebar>
	);
}
