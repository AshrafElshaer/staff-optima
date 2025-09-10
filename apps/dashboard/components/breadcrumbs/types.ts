import type { useServices } from "@optima/supabase/clients/use-services";

export type ServiceName = keyof ReturnType<typeof useServices>;

export interface DynamicSegmentData {
	id: string;
	name: string;
}

export interface DynamicSegmentConfig {
	service: ServiceName;
	method: string;
	nameField: string;
	queryKey: string;
}
