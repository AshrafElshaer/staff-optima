import { useSupabase } from "@optima/supabase/clients/use-supabase";
import { ServiceFactory } from "@optima/supabase/services";
import { useMemo } from "react";

export function useServices() {
	const supabase = useSupabase();

	const services = useMemo(() => {
		return ServiceFactory.getInstance(supabase);
	}, [supabase]);

	return services;
}
