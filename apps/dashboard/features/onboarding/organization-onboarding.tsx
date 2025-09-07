"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "@optima/location";
import { useServices } from "@optima/supabase/clients/use-services";
import { organizationInsertSchema } from "@optima/supabase/validations/organization.validations";

import { Button } from "@optima/ui/components/button";
import { Form } from "@optima/ui/components/form";
import {
	FormAddOnInput,
	FormCountrySelector,
	FormInput,
	FormSelect,
	FormTimezoneSelector,
} from "@optima/ui/components/form-controls";
import { Icons } from "@optima/ui/components/icons";
import { TextGenerateEffect } from "@optima/ui/components/text-animate";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCountdown } from "usehooks-ts";
import type { z } from "zod";
import { authClient } from "@/lib/auth/auth.client";

export function OrganizationOnboarding() {
	const [counter, { startCountdown }] = useCountdown({
		countStart: 3,
		intervalMs: 1000,
	});

	useEffect(() => {
		startCountdown();
	}, [startCountdown]);

	return (
		<AnimatePresence mode="wait">
			{counter !== 0 ? (
				<motion.div
					key={"welcome-message"}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.4 }}
					custom={{
						className: "flex-grow grid place-content-center w-full p-4",
					}}
				>
					<TextGenerateEffect
						words="Now, let's set up your company."
						className="w-full"
					/>
				</motion.div>
			) : (
				<motion.div
					key={"onboarding-form"}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.4 }}
					custom={{ className: "w-full p-4" }}
				>
					<OrganizationForm />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
const EMPLOYEE_COUNT_OPTIONS = [
	{ label: "1-10", value: "1-10" },
	{ label: "11-50", value: "11-50" },
	{ label: "51-200", value: "51-200" },
	{ label: "201-500", value: "201-500" },
	{ label: "500+", value: "500+" },
];
type OrganizationFormValues = z.infer<typeof organizationInsertSchema>;

function OrganizationForm() {
	const roleService = useServices().getRoleService();
	const domainService = useServices().getDomainService();
	const membershipService = useServices().getMembershipService();
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const form = useForm<OrganizationFormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: zod resolver having issues with zod v4
		resolver: zodResolver(organizationInsertSchema as any),
		defaultValues: {
			country: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			zipCode: "",
			industry: "",
			domain: "",
			name: "",
			logo: "",
			timezone: "",
			employeeCount: "",
			slug: "",
			isDomainVerified: false,
		},
	});
	const website = form.watch("domain");
	console.log("errors", form.formState.errors);

	useEffect(() => {
		if (website) {
			form.setValue("slug", website.replace(/^https?:\/\//, ""));
		}
	}, [website, form.setValue]);

	async function onSubmit(data: OrganizationFormValues) {
		const { data: slugCheck } = await authClient.organization.checkSlug({
			slug: data.slug,
		});
		if (!slugCheck?.status) {
			toast.error(
				"Domain already exists , please try a different one or contact support",
			);
			return;
		}
		// @ts-expect-error - type will infer the correct type
		const { data: organization, error } = await authClient.organization.create({
			...data,
			keepCurrentActiveOrganization: true,
		});
		if (!organization || error) {
			toast.error(error?.message ?? "Failed to create organization");

			console.log("org error", error);
			return;
		}
		await authClient.organization.setActive({
			organizationId: organization.id,
		});

		const role = await roleService.createRole({
			name: "owner",
			organizationId: organization.id,
			permissions: JSON.stringify([{ action: "manage", subject: "all" }]),
		});

		if (session && role) {
			await membershipService.updateMembership({
				userId: session.user.id,
				roleId: role.id,
			});
		}

		const { error: subscriptionError } = await authClient.subscription.upgrade({
			plan: "basic", // required
			referenceId: organization.id,
			metadata: {
				organizationId: organization.id,
				userId: session?.user.id,
			},
			seats: 1,
			successUrl: `${window.location.origin}/onboarding/congrats`, // required
			cancelUrl: `${window.location.origin}/onboarding/congrats`, // required
			returnUrl: `${window.location.origin}/onboarding/congrats`,
			disableRedirect: true, // required
		});

		if (subscriptionError) {
			console.log({ subscriptionError });
		}

		await domainService.createVerification({
			id: organization.id,
			slug: organization.slug,
		});

		router.push(`/onboarding/congrats`);
	}

	useEffect(() => {
		const countryCode = navigator.language.split("-")[1];
		const country = countries.find((country) => country.cca2 === countryCode);
		form.setValue("country", country?.name ?? "");
	}, [form.setValue]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
				<div className="flex flex-col sm:flex-row gap-6">
					<FormInput<OrganizationFormValues>
						name="name"
						label="Organization Name"
						placeholder="Acme Corp"
					/>
					<FormAddOnInput<OrganizationFormValues>
						name="domain"
						label="Website"
						placeholder="domain.example"
						addOn="https://"
						addOnDirection="start"
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-6">
					<FormInput<OrganizationFormValues>
						name="industry"
						label="Industry"
						placeholder="Technology"
					/>
					<FormSelect<OrganizationFormValues>
						name="employeeCount"
						label="Company Size"
						placeholder="Select Company Size"
						options={EMPLOYEE_COUNT_OPTIONS}
					/>
				</div>
				<FormInput<OrganizationFormValues>
					name="address1"
					label="Address 1"
					placeholder="123 Main st"
					isOptional
				/>

				<div className="flex flex-col sm:flex-row gap-6">
					<FormInput<OrganizationFormValues>
						name="address2"
						label="Address 2"
						placeholder="suite #512"
						isOptional
					/>

					<FormInput<OrganizationFormValues>
						name="city"
						label="City"
						placeholder="New York"
						isOptional
					/>
				</div>
				<div className="flex flex-col sm:flex-row gap-6">
					<FormInput<OrganizationFormValues>
						name="state"
						label="State"
						placeholder="Texas"
						isOptional
					/>

					<FormInput<OrganizationFormValues>
						name="zipCode"
						label="Zip Code"
						placeholder="12345"
						isOptional
					/>
				</div>
				<div className="flex flex-col sm:flex-row gap-6">
					<FormCountrySelector<OrganizationFormValues>
						name="country"
						label="Country"
					/>

					<FormTimezoneSelector<OrganizationFormValues>
						name="timezone"
						label="Timezone"
					/>
				</div>

				<Button
					size="sm"
					type="submit"
					className="w-full"
					disabled={form.formState.isSubmitting || status === "hasSucceeded"}
				>
					{form.formState.isSubmitting ? (
						<Icons.Loader className="size-4 animate-spin mr-2" />
					) : null}
					Complete Setup
				</Button>
			</form>
		</Form>
	);
}
