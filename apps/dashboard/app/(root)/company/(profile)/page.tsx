import { createServerClient } from "@optima/supabase/clients/server";
import { ServiceFactory } from "@optima/supabase/services";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { CompanyProfileForm } from "@/features/company/profile/profile-form";

export const metadata: Metadata = {
	title: "Profile",
	description: "Manage Organization Public Profile",
};

export default async function ProfilePage() {
	const headersList = await headers();
	const organizationId = headersList.get("x-organization-id");
	const supabase = await createServerClient();
	const organizationService =
		ServiceFactory.getInstance(supabase).getOrganizationService();
	const organization = await organizationService.getById(organizationId ?? "");

	return <CompanyProfileForm company={organization} />;
}
