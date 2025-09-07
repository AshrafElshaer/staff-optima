"use server";
import { revalidatePath } from "next/cache";
import z from "zod";
import { auth } from "@/lib/auth/auth.server";
import { authActionClient } from "@/lib/safe-action";

export const createDepartment = authActionClient
	.metadata({
		name: "create-department",
	})
	.inputSchema(
		z.object({
			name: z.string(),
		}),
	)
	.action(async ({ parsedInput: { name }, ctx }) => {
		const { abilities, session } = ctx;
		const canCreate = abilities.can("create", "department");
		if (!canCreate) {
			throw new Error("You are not allowed to create a department");
		}
		//@ts-ignore
		const { data, error } = await auth.api.createTeam({
			body: {
				name,
				organizationId: session.session.activeOrganizationId as string,
			},
		});
		if (error) {
			throw new Error(error.message);
		}

		revalidatePath("/company/departments");
		return data;
	});
