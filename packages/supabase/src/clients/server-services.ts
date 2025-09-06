import { ServiceFactory } from "../services";
import { createServerClient } from "./server";

export async function getServerServices() {
	const supabase = await createServerClient();
	return ServiceFactory.getInstance(supabase);
}
