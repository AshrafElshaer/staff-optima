"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@optima/ui/components/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useDynamicBreadcrumb } from "@/hooks/use-dynamic-breadcrumb";
import type { DynamicSegmentConfig } from "./types";

const SEGMENTS_MAP = new Map([
	["company", "Profile"],
	["departments", "Departments"],
	["access-control", "Roles & Permissions"],
	["integrations", "Integrations"],
	["billing", "Billing & Usage"],
	["stages-workflows", "Stages & Workflows"],
	["email-templates", "Email Templates"],
]);

const DYNAMIC_SEGMENTS = new Map<string, DynamicSegmentConfig>([
	[
		"departments",
		{
			service: "getDepartmentService",
			method: "getById",
			nameField: "name",
			queryKey: "department",
		},
	],
]);

export function CompanyBreadcrumb() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);
	const companyIndex = segments.indexOf("company");
	const companySegments = segments.slice(companyIndex + 1);

	const { dynamicNames, isLoading } = useDynamicBreadcrumb({
		segments: companySegments,
		segmentConfigs: DYNAMIC_SEGMENTS,
	});

	if (companyIndex === -1 || !pathname.includes("/company")) {
		return null;
	}

	if (companySegments.length === 0) {
		return (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Profile</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{companySegments.map((segment, index) => {
					const isLast = index === companySegments.length - 1;
					const href = `/company/${companySegments.slice(0, index + 1).join("/")}`;
					const displayName =
						dynamicNames[segment] || SEGMENTS_MAP.get(segment) || segment;

					return (
						<Fragment key={`${segment}-${index.toString()}`}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>
										{isLoading ? "Loading..." : displayName}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>
											{isLoading ? "Loading..." : displayName}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
