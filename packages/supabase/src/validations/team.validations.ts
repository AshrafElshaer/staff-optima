import { z } from "zod";

export const teamSchema = z.object({
	id: z.uuid({ message: "Invalid team ID." }),
	name: z
		.string()
		.min(2, { message: "Team name must be at least 2 characters long." })
		.max(100, { message: "Team name must be at most 100 characters long." }),
	description: z
		.string()
		.max(500, { message: "Description must be at most 500 characters long." })
		.optional()
		.or(z.literal("").transform(() => undefined)),
	organizationId: z.uuid({ message: "Invalid organization ID." }),
	managerId: z.uuid({ message: "Manager is required." }),
});

export const updateTeamSchema = teamSchema.partial().required({
	id: true,
});

export const createTeamSchema = teamSchema.omit({
	id: true,
	organizationId: true,
});
