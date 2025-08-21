import type { SupabaseInstance } from "../types";

export const getOrganizationById = async (
	supabase: SupabaseInstance,
	organizationId: string,
) => {
	const { data, error } = await supabase
		.from("organization")
		.select("*")
		.eq("id", organizationId)
		.single();
	if (error) {
		throw error;
	}
	return data;
};
