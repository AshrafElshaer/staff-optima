import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function updateOrganization(
	supabase: SupabaseInstance,
	organization: TablesUpdate<"organization">,
) {
	if (!organization.id) {
		throw new Error("Organization ID is required");
	}
	if (organization.domain) {
		const { error: organizationError } = await supabase
			.from("domain_verification")
			.update({
				verification_date: null,
				verification_status: "pending",
				verification_token: crypto.randomUUID(),
				updated_at: new Date().toISOString(),
			})
			.eq("domain", organization.domain)
			.eq("organization_id", organization.id);
		if (organizationError) {
			throw organizationError;
		}
		organization.slug = organization.domain;
	}
	const { data, error } = await supabase
		.from("organization")
		.update(organization)
		.eq("id", organization.id)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}
