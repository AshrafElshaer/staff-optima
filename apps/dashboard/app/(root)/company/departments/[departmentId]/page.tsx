import { getServerServices } from "@optima/supabase/clients/server-services";

type PageParams = {
	departmentId: string;
};

export default async function DepartmentPage({
	params,
}: {
	params: Promise<PageParams>;
}) {
	const { departmentId } = await params;

	const departmentService = (await getServerServices()).getDepartmentService();
	const department = await departmentService.getById(departmentId);

	return (
		<div>
			{department.name}
			{department.description}
		</div>
	);
}
