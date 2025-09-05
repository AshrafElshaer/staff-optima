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

const SEGMENTS_MAP = new Map([
	["company", "Profile"],
	["departments", "Departments"],
	["access-control", "Roles & Permissions"],
	["integrations", "Integrations"],
	["billing", "Billing & Usage"],
	["stages-workflows", "Stages & Workflows"],
	["email-templates", "Email Templates"],
]);

export function CompanyBreadcrumb() {
	const pathname = usePathname();

	if (!pathname.includes("/company")) {
		return null;
	}

	const segments = pathname.split("/").filter(Boolean);
	const companyIndex = segments.indexOf("company");

	if (companyIndex === -1) {
		return null;
	}

	// Get only the segments after "company"
	const companySegments = segments.slice(companyIndex + 1);

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
					const displayName = SEGMENTS_MAP.get(segment) || segment;

					return (
						<BreadcrumbItem key={`${segment}-${index.toString()}`}>
							{isLast ? (
								<BreadcrumbPage>{displayName}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link href={href}>{displayName}</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
