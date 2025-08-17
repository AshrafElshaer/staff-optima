import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function createMembership(
	supabase: SupabaseInstance,
	membership: TablesInsert<"member">,
) {
	const { data, error } = await supabase
		.from("member")
		.insert(membership)
		.select();
	if (error) throw error;
	return data;
}

export async function updateMembership(
	supabase: SupabaseInstance,
	membership: TablesUpdate<"member">,
) {
	if (!membership.userId) throw new Error("Membership ID is required");
	const { data, error } = await supabase
		.from("member")
		.update(membership)
		.eq("userId", membership.userId)
		.select();
	if (error) throw error;
	return data;
}
