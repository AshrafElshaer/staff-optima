import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function createUser(
	supabase: SupabaseInstance,
	user: TablesInsert<"user">,
) {
	const { data, error } = await supabase.from("user").insert(user).select();
	if (error) throw error;
	return data;
}

export async function updateUser(
	supabase: SupabaseInstance,
	user: TablesUpdate<"user">,
) {
	if (!user.id) throw new Error("User ID is required");
	const { data, error } = await supabase
		.from("user")
		.update(user)
		.eq("id", user.id)
		.select();
	if (error) throw error;
	return data;
}
