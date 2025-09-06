import { getServerServices } from "@optima/supabase/clients/server-services";
import { headers } from "next/headers";
import { departmentSearchCache } from "../departments.search-params";
import { DepartmentCard } from "./department-card";

export async function DepartmentsList() {
	const filters = departmentSearchCache.all();
	const headersList = await headers();
	const organizationId = headersList.get("x-organization-id");
	const departmentService = (await getServerServices()).getDepartmentService();
	const departments = await departmentService.searchDepartments(
		organizationId ?? "",
		filters.name,
	);

	if (departments.length === 0) {
		return (
			<div className="flex flex-col gap-2 flex-1 items-center justify-center">
				<p className="text-muted-foreground">No departments found</p>
			</div>
		);
	}

	return (
		<section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{departments.map((department) => (
				<DepartmentCard key={department.id} department={department} />
			))}
		</section>
	);
}
