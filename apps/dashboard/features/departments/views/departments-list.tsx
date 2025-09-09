import { getServerServices } from "@optima/supabase/clients/server-services";
import { Grid, Text } from "@radix-ui/themes";
import { headers } from "next/headers";
import { departmentSearchCache } from "../departments.search-params";
import { DepartmentCard } from "./department-card";

export async function DepartmentsList() {
	const filters = departmentSearchCache.all();
	const headersList = await headers();
	const organizationId = headersList.get("x-organization-id");
	const departmentService = (await getServerServices()).getDepartmentService();
	const departments = await departmentService.getAllByOrganizationId(
		organizationId ?? "",
	);

	if (departments.length === 0) {
		return (
			<div className="flex flex-col gap-2 flex-1 items-center justify-center">
				<Text className="text-muted-foreground">No departments found</Text>
			</div>
		);
	}

	return (
		<Grid
			columns={{
				initial: "1",
				md: "2",
				lg: "3",
			}}
			gap="4"
		>
			{departments.map((department) => (
				<DepartmentCard key={department.id} department={department} />
			))}
		</Grid>
	);
}
