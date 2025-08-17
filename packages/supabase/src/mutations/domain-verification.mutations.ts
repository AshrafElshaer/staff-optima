import type { SupabaseInstance, TablesInsert, TablesUpdate } from "../types";

export async function createDomainVerification(
	supabase: SupabaseInstance,
	data: TablesInsert<"domain_verification">,
) {
	const { data: domainVerification, error } = await supabase
		.from("domain_verification")
		.insert(data)
		.select()
		.single();

	if (error) {
		throw error;
	}
	return domainVerification;
}

export async function updateDomainVerification(
	supabase: SupabaseInstance,
	data: TablesUpdate<"domain_verification">,
) {
	if (!data.domain) {
		throw new Error("Domain is required");
	}

	const { data: domainVerification, error } = await supabase
		.from("domain_verification")
		.update(data)
		.eq("domain", data.domain)
		.select()
		.single();

	if (error) {
		throw error;
	}
	return domainVerification;
}
