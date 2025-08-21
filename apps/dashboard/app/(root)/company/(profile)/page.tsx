import { createServerClient } from "@optima/supabase/clients/server";
import { getOrganizationById } from "@optima/supabase/queries/organizaation.queries";
import { headers } from "next/headers";
import { CompanyProfileForm } from "@/features/company/profile/profile-form";
export default async function ProfilePage() {
	const headersList = await headers();
	const organizationId = headersList.get("x-organization-id");
	const supabase = await createServerClient();
	const organization = await getOrganizationById(
		supabase,
		organizationId ?? "",
	);
	return <CompanyProfileForm company={organization} />;
}
