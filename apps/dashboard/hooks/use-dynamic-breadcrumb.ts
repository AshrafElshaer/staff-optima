import { useServices } from "@optima/supabase/clients/use-services";
import { useQueries } from "@tanstack/react-query";
import type {
	DynamicSegmentConfig,
	DynamicSegmentData,
} from "@/components/breadcrumbs/types";

interface UseDynamicBreadcrumbOptions {
	segments: string[];
	segmentConfigs: Map<string, DynamicSegmentConfig>;
}

export function useDynamicBreadcrumb({
	segments,
	segmentConfigs,
}: UseDynamicBreadcrumbOptions) {
	const services = useServices();

	const queries = segments
		.map((segment, index) => {
			const prevSegment = index > 0 ? segments[index - 1] : null;
			const config = prevSegment ? segmentConfigs.get(prevSegment) : null;

			if (!config) return null;

			return {
				queryKey: [config.queryKey, segment],
				queryFn: async (): Promise<DynamicSegmentData> => {
					const service = services[config.service]();
					// @ts-ignore - Dynamic method access
					const data = await service[config.method](segment);
					return {
						id: segment,
						name: data?.[config.nameField] ?? segment,
					};
				},
				enabled: Boolean(segment && config),
			};
		})
		.filter(Boolean);

	const results = useQueries({
		queries: queries as Array<{
			queryKey: string[];
			queryFn: () => Promise<DynamicSegmentData>;
			enabled: boolean;
		}>,
	});

	const dynamicNames = results.reduce<Record<string, string>>((acc, result) => {
		if (result.data) {
			acc[result.data.id] = result.data.name;
		}
		return acc;
	}, {});

	return {
		dynamicNames,
		isLoading: results.some((result) => result.isLoading),
		isError: results.some((result) => result.isError),
	};
}
