import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { departmentSearchCache } from "@/features/departments/departments.search-params";
import { DepartmentsList } from "@/features/departments/views/departments-list";
import { DepartmentsLoading } from "@/features/departments/views/departments-loading";
import { DepartmentSearch } from "@/features/departments/views/departments-search";

export const metadata: Metadata = {
	title: "Departments",
	description: "Manage Organization Departments",
};

type Params = {
	searchParams: Promise<SearchParams>;
};

export default async function OrganizationDepartmentsPage({
	searchParams,
}: Params) {
	await departmentSearchCache.parse(searchParams);
	return (
		<div className="flex flex-col gap-4 flex-1 p-4">
			<section className="flex items-center gap-4 justify-between">
				<DepartmentSearch />
				{/* <NewDepartment /> */}
			</section>
			<Suspense fallback={<DepartmentsLoading />}>
				<DepartmentsList />
			</Suspense>
		</div>
	);
}
