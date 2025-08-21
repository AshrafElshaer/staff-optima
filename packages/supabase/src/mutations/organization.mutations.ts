import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function updateOrganization(
	supabase: SupabaseInstance,
	organization: TablesUpdate<"organization">,
) {
	if (!organization.id) {
		throw new Error("Organization ID is required");
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
