import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function createRole(
	supabase: SupabaseInstance,
	role: TablesInsert<"role">,
) {
	const { data, error } = await supabase
		.from("role")
		.insert(role)
		.select()
		.single();
	if (error) throw error;
	return data;
}

export async function updateRole(
	supabase: SupabaseInstance,
	role: TablesUpdate<"role">,
) {
	if (!role.id) throw new Error("Role ID is required");
	const { data, error } = await supabase
		.from("role")
		.update(role)
		.eq("id", role.id)
		.select();
	if (error) throw error;
	return data;
}
