import { z } from "zod/v4";

export const organizationSchema = z.object({
	address1: z.string().nullable().optional(),
	address2: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	country: z.string().min(1, { message: "Country is required" }),
	createdAt: z.string().optional(),
	domain: z
		.string()
		.min(1, { message: "Domain is required" })
		.refine(
			(val) => {
				// This regex validates domains without protocols
				const domainRegex =
					/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
				return domainRegex.test(val);
			},
			{ message: "Please enter a valid domain (e.g., example.com)" },
		),
	employeeCount: z.string().nullable().optional(),
	id: z.string(),
	industry: z.string().min(1, { message: "Industry is required" }),
	isDomainVerified: z.boolean().nullable().optional(),
	logo: z.string().nullable().optional(),
	metadata: z.string().nullable().optional(),
	name: z.string().min(1, { message: "Name is required" }),
	profile: z.string().nullable().optional(),
	slug: z.string().min(1, { message: "Slug is required" }),
	state: z.string().nullable().optional(),
	timezone: z.string().min(1, { message: "Timezone is required" }),
	zipCode: z.string().nullable().optional(),
});

export const organizationInsertSchema = organizationSchema.omit({
	id: true,
	createdAt: true,
	metadata: true,
	profile: true,
});

export const organizationUpdateSchema = organizationSchema.partial().required({
	id: true,
});
