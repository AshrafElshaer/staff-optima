import type { OrganizationUpdate } from "@optima/supabase/types";
import { useMutation } from "@tanstack/react-query";
import { invalidateDomainVerification } from "@/features/company/profile/domain-verification";
import { authClient } from "@/lib/auth/auth.client";
import { useServices } from "./use-services";

export function useCompany() {
	const services = useServices();
	const organizationService = services.getOrganizationService();
	const { data: company, refetch } = authClient.useActiveOrganization();

	const {
		mutate: updateOrganizationMutation,
		status: updateStatus,
		isPending: isUpdating,
		isSuccess: isUpdated,
		isError: isErrorUpdating,
		error: updateError,
		reset: resetUpdate,
	} = useMutation({
		mutationFn: (data: OrganizationUpdate & { id: string }) =>
			organizationService.updateOrganization(data),
		onSuccess: (result) => {
			if (!result.isDomainVerified) {
				invalidateDomainVerification(result.id);
			}
			refetch();
		},
		onSettled: () => {
			setTimeout(() => {
				resetUpdate();
			}, 3000);
		},
	});

	return {
		company,
		updateOrganizationMutation,
		updateStatus,
		isUpdating,
		isUpdated,
		isErrorUpdating,
		updateError,
	};
}
