import { createClient } from "@supabase/supabase-js";
import type { Database, SupabaseInstance } from "../types";

export type SupabaseClientOptions = {
	isAdmin: boolean;
};

export function createBrowserClient(
	options?: SupabaseClientOptions,
): SupabaseInstance {
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		options?.isAdmin
			? (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY as string)
			: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string),
	);
}
