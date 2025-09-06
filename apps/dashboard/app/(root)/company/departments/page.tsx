// import { departmentSearchLoader } from "@/features/company/departments/departments.search-params";
// import { DepartmentCard } from "@/features/company/departments/views/department-card";
// import { DepartmentSearch } from "@/features/company/departments/views/department-search";
// import { NewDepartment } from "@/features/company/departments/views/new-department";
// import { createServerClient } from "@/lib/supabase/server";
// import { getDepartmentsWithJobsAndApplications } from "@optima/supabase/queries";
// import type { Department, JobPost, Application } from "@optima/supabase/types";

import { getServerServices } from "@optima/supabase/clients/server-services";
import type { Metadata } from "next";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs";
import { departmentSearchLoader } from "@/features/departments/departments.search-params";
import { DepartmentCard } from "@/features/departments/views/department-card";
import { DepartmentSearch } from "@/features/departments/views/departments-search";

export const metadata: Metadata = {
	title: "Departments",
	description: "Manage Organization Departments",
};

type Params = {
	searchParams: Promise<SearchParams>;
};

// export interface DepartmentWithJobPostsAndApplications extends Department {
// 	job_posts: JobPost[];
// 	applications: Application[];
// }

export default async function OrganizationDepartmentsPage({
	searchParams,
}: Params) {
	const filters = await departmentSearchLoader(searchParams);
	const headersList = await headers();
	const organizationId = headersList.get("x-organization-id");
	const departmentService = (await getServerServices()).getDepartmentService();
	const departments = await departmentService.searchDepartments(
		organizationId ?? "",
		filters.name,
	);

	return (
		<div className="flex flex-col gap-4 flex-1 p-4">
			<section className="flex items-center gap-4 justify-between">
				<DepartmentSearch />
				{/* <NewDepartment /> */}
			</section>
			{departments?.length === 0 ? (
				<div className="flex flex-col gap-2 flex-1 items-center justify-center">
					<p className="text-sm text-muted-foreground">No departments found</p>
					<p className="text-muted-foreground">
						Start by creating a new department
					</p>
				</div>
			) : (
				<section className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{departments?.map((department) => (
						<DepartmentCard key={department.id} department={department} />
					))}
				</section>
			)}
		</div>
	);
}
