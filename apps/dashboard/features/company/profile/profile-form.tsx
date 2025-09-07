"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@optima/editor/src/index";
import { useServices } from "@optima/supabase/clients/use-services";
import { useSupabase } from "@optima/supabase/clients/use-supabase";
import type { OrganizationRow } from "@optima/supabase/types";
import { uploadOrganizationLogo } from "@optima/supabase/utils/upload-file";
import { organizationUpdateSchema } from "@optima/supabase/validations/organization.validations";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@optima/ui/components/avatar";
import { buttonVariants } from "@optima/ui/components/button";
import {
	type DropzoneOptions,
	FileDropZone,
} from "@optima/ui/components/file-upload-zone";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@optima/ui/components/form";
import {
	FormAddOnInput,
	FormCountrySelector,
	FormInput,
	FormSelect,
	FormTimezoneSelector,
} from "@optima/ui/components/form-controls";
import { Label } from "@optima/ui/components/label";
import { Separator } from "@optima/ui/components/separator";
import { cn } from "@optima/ui/lib/utils";
import { Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { OnChangeToast } from "@/components/toasts/on-change-toast";
import { useActionToast } from "@/hooks/use-actions-toast";
import { useCompany } from "@/hooks/use-company";
import { authClient } from "@/lib/auth/auth.client";
import { getDirtyFields } from "@/lib/form/get-dirty-fields";
import { DomainVerification } from "./domain-verification";

type OrganizationFormValues = z.infer<typeof organizationUpdateSchema>;

const DROP_ZONE_OPTIONS: DropzoneOptions = {
	accept: {
		"image/png": [".png"],
		"image/jpeg": [".jpg", ".jpeg"],
		"image/svg+xml": [".svg"],
		"image/webp": [".webp"],
		"image/x-icon": [".ico"],
	},
	maxSize: 1000000,
	maxFiles: 1,
	multiple: false,
};

export function CompanyProfileForm({
	company,
}: {
	company: OrganizationRow | undefined;
}) {
	const [resetKey, setResetKey] = useState(0);
	const supabase = useSupabase();
	const services = useServices();
	const organizationService = services.getOrganizationService();
	const { updateOrganizationMutation, updateStatus, updateError } =
		useCompany();
	const formSubmitRef = useRef<HTMLButtonElement | null>(null);

	const defaultValues = useMemo(() => {
		if (!company) return undefined;
		return Object.fromEntries(
			Object.entries(company).map(([key, value]) => [
				key,
				value === null ? undefined : value,
			]),
		);
	}, [company]);

	const form = useForm<OrganizationFormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: zod resolver having issues with zod v4
		resolver: zodResolver(organizationUpdateSchema as any),
		defaultValues,
	});

	async function onSubmit(values: OrganizationFormValues) {
		const payload = getDirtyFields<OrganizationFormValues>(form, values);
		if (!payload.id) {
			toast.error("Organization ID is required");
			return;
		}

		if (payload?.domain) {
			const { data } = await authClient.organization.checkSlug({
				slug: payload.domain,
			});
			if (!data?.status) {
				toast.warning("Domain is already in use");
				return;
			}
			toast.warning("Domain has changed. Please re-verify your domain.");
		}

		updateOrganizationMutation(payload, {
			onSuccess: (result) => {
				setTimeout(() => {
					form.reset(
						result
							? (Object.fromEntries(
									Object.entries(result).map(([key, value]) => [
										key,
										value === null ? undefined : value,
									]),
								) as OrganizationFormValues)
							: undefined,
						{
							keepDirty: false,
						},
					);
				}, 3000);
			},
		});
	}

	async function uploadLogo(file: File) {
		toast.promise(
			async () => {
				const publicUrl = await uploadOrganizationLogo(
					supabase,
					form.getValues("id") ?? "",
					file,
					{
						upsert: true,
					},
				);
				form.setValue("logo", publicUrl, {
					shouldDirty: false,
				});
				await organizationService.updateOrganization({
					id: form.getValues("id") ?? "",
					logo: publicUrl,
				});
			},
			{
				loading: "Uploading logo...",
				success: "Logo uploaded successfully",
				error: ({ error }) => error,
			},
		);
	}

	const handleReset = () => {
		form.reset(
			company
				? {
						...company,
						profile: company.profile ?? undefined,
						logo: company.logo ?? null,
						address1: company.address1 ?? null,
						address2: company.address2 ?? null,
						city: company.city ?? null,
						createdAt: company.createdAt ?? "",
						name: company.name ?? "",
						domain: company.domain ?? "",
						industry: company.industry ?? "",
						country: company.country ?? "",
						timezone: company.timezone ?? "",
					}
				: undefined,
			{
				keepDirty: false,
			},
		);
		setResetKey((prev) => prev + 1);
	};

	const ToastContent = useCallback(() => {
		return (
			<OnChangeToast
				state={updateStatus}
				onReset={handleReset}
				onSave={() => {
					formSubmitRef.current?.click();
				}}
				errorMessage={updateError?.message}
			/>
		);
	}, [updateStatus, updateError]);

	useActionToast({
		show: form.formState.isDirty,
		ToastContent,
	});

	const logoUrl = useMemo(
		() => `${form.watch("logo")}?${Date.now()}`,
		[form.watch("logo")],
	);

	return (
		<Container size="3">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full  mx-auto px-4 py-8"
				>
					<Flex
						direction={{
							initial: "column-reverse",
							sm: "row",
						}}
						justify="between"
						align={"start"}
						className="w-full gap-4"
					>
						<Box className="space-y-2">
							<Label className="font-semibold text-base">Company Logo</Label>
							<Text as="p" size="2" className="text-muted-foreground">
								Accepts : PNG, JPG, or SVG.
								<br />
								Max size : 1MB
								<br />
								Recommended dimensions: 200x200 pixels.
							</Text>
						</Box>
						<FileDropZone
							config={{
								...DROP_ZONE_OPTIONS,
								onDrop: async (acceptedFiles) => {
									const file = acceptedFiles[0];
									if (file) {
										await uploadLogo(file);
									}
								},
								onDropRejected: (rejectedFiles) => {
									for (const file of rejectedFiles) {
										toast.error(file.errors[0]?.message);
									}
								},
							}}
						>
							<Avatar className="rounded-md size-28">
								<AvatarImage
									src={logoUrl}
									className={cn("rounded-md size-28", {
										hidden: !form.watch("logo"),
									})}
									alt={company?.name ?? ""}
								/>
								<AvatarFallback className="text-7xl rounded-md size-28">
									{`${company?.name[0]}${company?.name[1]}`}
								</AvatarFallback>
							</Avatar>
							<div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center">
								<Plus className="size-10 text-secondary-foreground" />
							</div>
						</FileDropZone>
					</Flex>
					<Separator />
					<Flex
						direction={{
							initial: "column",
							sm: "row",
						}}
						justify="between"
						align="start"
						className="w-full gap-4"
					>
						<Box className="space-y-2 w-full md:w-1/2">
							<Label className="font-semibold text-base" htmlFor="name">
								Legal Name
							</Label>
							<FormDescription>Company's registered legal name</FormDescription>
						</Box>
						<Box className="w-full md:w-1/2">
							<FormInput<OrganizationFormValues> id="name" name="name" />
						</Box>
					</Flex>
					<Separator />
					<Flex
						direction={{
							initial: "column",
							sm: "row",
						}}
						justify="between"
						align="start"
						className="w-full gap-4"
					>
						<Box className="space-y-2 w-full md:w-1/2">
							<Label className="font-semibold text-base" htmlFor="industry">
								Industry
							</Label>
							<FormDescription>Company's industry</FormDescription>
						</Box>
						<Box className="w-full md:w-1/2">
							<FormInput<OrganizationFormValues>
								id="industry"
								name="industry"
							/>
						</Box>
					</Flex>
					<Separator />
					<Flex
						direction={{
							initial: "column",
							sm: "row",
						}}
						justify="between"
						align="start"
						className="w-full gap-4"
					>
						<Box className="space-y-2 w-full md:w-1/2">
							<Label
								className="font-semibold text-base"
								htmlFor="employeeCount"
							>
								Company Size
							</Label>
							<FormDescription>Company's employee count</FormDescription>
						</Box>
						<Box className="w-full md:w-1/2">
							<FormSelect<OrganizationFormValues>
								name="employeeCount"
								options={[
									{ label: "1-10", value: "1-10" },
									{ label: "11-50", value: "11-50" },
									{ label: "51-200", value: "51-200" },
									{ label: "201-500", value: "201-500" },
									{ label: "+ 500", value: "+ 500" },
								]}
							/>
						</Box>
					</Flex>
					<Separator />
					<Flex
						direction={{
							initial: "column",
							sm: "row",
						}}
						justify="between"
						align="start"
						className="w-full gap-4"
					>
						<Box className="space-y-2 w-full md:w-1/2">
							<Label className="font-semibold text-base" htmlFor="domain">
								Domain
							</Label>
							<FormDescription>
								Company's official website domain.
							</FormDescription>
						</Box>
						<Box className="w-full md:w-1/2">
							<FormAddOnInput<OrganizationFormValues>
								name="domain"
								id="domain"
								addOn="https://"
								addOnDirection="start"
							/>
						</Box>
					</Flex>
					<DomainVerification companyId={form.getValues("id") ?? ""} />
					<Separator />
					<Flex direction="column" gap="4" width="full">
						<Box className="space-y-2" width="full">
							<Label className="font-semibold text-base" htmlFor="address1">
								Location
							</Label>
							<FormDescription>Company's headquarter address</FormDescription>
						</Box>
						<FormInput<OrganizationFormValues>
							name="address1"
							id="address1"
							placeholder="123 Main St"
							label="Address 1"
							isOptional
						/>
						<Grid
							mt="4"
							columns={{
								initial: "1",
								sm: "2",
							}}
							gap="8"
							width="auto"
						>
							<FormInput<OrganizationFormValues>
								name="address2"
								id="address2"
								placeholder="Suite 542"
								label="Address 2"
								isOptional
							/>
							<FormInput<OrganizationFormValues>
								name="city"
								id="city"
								placeholder="San Francisco"
								label="City"
								isOptional
							/>
							<FormInput<OrganizationFormValues>
								name="state"
								id="state"
								placeholder="California"
								label="State"
								isOptional
							/>
							<FormInput<OrganizationFormValues>
								name="zipCode"
								id="zipCode"
								placeholder="12345"
								label="Zip Code"
								isOptional
							/>
							<FormCountrySelector
								name="country"
								id="country"
								label="Country"
							/>
							<FormTimezoneSelector
								name="timezone"
								id="timezone"
								label="Timezone"
							/>
						</Grid>
					</Flex>
					<Separator />
					<Flex direction="column" gap="4" width="full">
						<Flex direction="row" justify="between" align="center" gap="4">
							<Box className="space-y-2" width="full">
								<Label className="font-semibold text-base">Profile</Label>
								<Text
									as="p"
									size="2"
									className="text-muted-foreground md:w-3/4"
								>
									Write a detailed profile showcasing your company's mission,
									values, services, and achievements.
								</Text>
							</Box>
							<Box
								width={{
									initial: "full",
									sm: "auto",
								}}
							>
								<Link
									href={`https://jobs.staffoptima.co/${company?.domain}`}
									className={buttonVariants({ variant: "secondary" })}
									target="_blank"
								>
									Preview
								</Link>
							</Box>
						</Flex>
						<FormField
							control={form.control}
							name="profile"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="w-full border rounded-md min-h-96 grid overflow-hidden">
											<Editor
												key={resetKey}
												content={field.value ?? ""}
												onChange={(_value) => field.onChange(_value ?? "")}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</Flex>
					<button type="submit" ref={formSubmitRef} className="hidden">
						save
					</button>
				</form>
			</Form>
		</Container>
	);
}
