import { z } from "zod";

export const userSchema = z.object({
	id: z.uuid(),
	email: z.email({ error: "Invalid email address" }),
	emailVerified: z.boolean().default(false),
	name: z.string().min(1, { message: "Name is required" }),
	image: z.string().nullable().optional(),
	jobTitle: z.string().min(1, { message: "Job title is required" }),
	phoneNumber: z.string().min(1, { message: "Phone number is required" }),
	phoneNumberVerified: z.boolean().default(false),
	stripeCustomerId: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const userInsertSchema = userSchema.omit({
	id: true,
	emailVerified: true,
	phoneNumberVerified: true,
	stripeCustomerId: true,
	createdAt: true,
	updatedAt: true,
});

export const userUpdateSchema = userSchema.partial().required({
	id: true,
});
