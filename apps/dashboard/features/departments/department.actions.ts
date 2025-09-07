"use server";
import { createTeamSchema } from "@optima/supabase/validations/team.validations";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/lib/safe-action";

export const createDepartment = authActionClient
	.metadata({
		name: "create-department",
	})
	.inputSchema(createTeamSchema)
	.action(async ({ parsedInput: { name, managerId, description }, ctx }) => {
		const { abilities, session, services } = ctx;
		const canCreate = abilities.can("create", "department");
		if (!canCreate) {
			throw new Error("You are not allowed to create a department");
		}

		const organizationId = session.session.activeOrganizationId as string;
		const departmentService = services.getDepartmentService();
		const department = await departmentService.create({
			name,
			organizationId,
			managerId,
			description,
		});

		revalidatePath("/company/departments");
		return department;
	});
