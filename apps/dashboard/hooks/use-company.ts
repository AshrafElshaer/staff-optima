import { useSupabase } from "@optima/supabase/clients/use-supabase";
import { updateOrganization } from "@optima/supabase/mutations/organization.mutations";
import type { Organization, OrganizationUpdate } from "@optima/supabase/types";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth.client";

export function useCompany() {
	const supabase = useSupabase();
	const { data: company, refetch } = authClient.useActiveOrganization();
	const {
		mutate: updateOrganizationMutation,
		status: updateStatus,
		isPending: isUpdating,
		isSuccess: isUpdated,
		isError: isErrorUpdating,
	} = useMutation({
		mutationFn: (data: OrganizationUpdate) =>
			updateOrganization(supabase, data),
		onSuccess: () => {
			refetch();
		},
	});

	return {
		company,
		updateOrganizationMutation,
		updateStatus,
		isUpdating,
		isUpdated,
		isErrorUpdating,
	};
}
