"use client";
import { zodResolver } from "@hookform/resolvers/zod";
// import { OnChangeToast } from "@/components/toasts/on-change-toast";
// import { useActionToast } from "@/hooks/use-action-toast";
// import { createBrowserClient } from "@/lib/supabase/browser";
import { useSupabase } from "@optima/supabase/clients/use-supabase";
import { updateOrganization } from "@optima/supabase/mutations/organization.mutations";
// import Editor from "@optima/editor";
import type { Organization, TablesUpdate } from "@optima/supabase/types";
import { uploadOrganizationLogo } from "@optima/supabase/utils/upload-file";
import {
	organizationSchema,
	organizationUpdateSchema,
} from "@optima/supabase/validations/organization.validations";
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
	FormLabel,
	FormMessage,
} from "@optima/ui/components/form";
import {
	FormCountrySelector,
	FormInput,
	FormTimezoneSelector,
} from "@optima/ui/components/form-controls";
import { Input } from "@optima/ui/components/inputs";
import { Label } from "@optima/ui/components/label";
// import { uploadCompanyLogo } from "@/lib/supabase/storage";
import { CountrySelector } from "@optima/ui/components/selectors/country-selector";
import { Separator } from "@optima/ui/components/separator";
import { cn } from "@optima/ui/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
// import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { OnChangeToast } from "@/components/toasts/on-change-toast";
import { useActionToast } from "@/hooks/use-actions-toast";
import { useCompany } from "@/hooks/use-company";
import { authClient } from "@/lib/auth/auth.client";
import { getDirtyFields } from "@/lib/form/get-dirty-fields";
import { queryClient } from "@/lib/react-query/query-client";

// import { updateOrganizationAction } from "../company.actions";
// import { DomainVerification } from "./domain-verification";

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
	company: Organization | undefined;
}) {
	const [resetKey, setResetKey] = useState(0);
	const supabase = useSupabase();
	const {
		updateOrganizationMutation,
		updateStatus,
		isUpdating,
		isUpdated,
		isErrorUpdating,
		updateError,
	} = useCompany();
	const formSubmitRef = useRef<HTMLButtonElement | null>(null);

	const router = useRouter();

	// const {
	// 	execute: updateOrganization,
	// 	executeAsync: updateOrganizationAsync,
	// 	status,
	// 	result,
	// 	reset: resetAction,
	// 	isExecuting,
	// } = useAction(updateOrganizationAction, {
	// 	onError: () => {
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["domain-verification"],
	// 		});
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["company"],
	// 		});
	// 		setTimeout(() => {
	// 			resetAction();
	// 		}, 3000);
	// 	},
	// 	onSuccess: ({ data, input }) => {
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["company"],
	// 		});
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["domain-verification"],
	// 		});
	// 		if (input.domain) {
	// 			toast.warning(
	// 				"Domain verification is required. Please re-verify your domain.",
	// 			);
	// 		}
	// 		setTimeout(() => {
	// 			form.reset(
	// 				data
	// 					? {
	// 							...data,
	// 							profile: data.profile ?? undefined,
	// 							logo: data.logo ?? null,
	// 							admin_id: data.admin_id ?? "",
	// 							address_1: data.address_1 ?? null,
	// 							address_2: data.address_2 ?? null,
	// 							city: data.city ?? null,
	// 							created_at: data.created_at ?? "",
	// 							updated_at: data.updated_at ?? "",
	// 							name: data.name ?? "",
	// 							domain: data.domain ?? "",
	// 							industry: data.industry ?? "",
	// 							country: data.country ?? "",
	// 							timezone: data.timezone ?? "",
	// 						}
	// 					: undefined,
	// 				{
	// 					keepDirty: false,
	// 				},
	// 			);
	// 			setResetKey((prev) => prev + 1);
	// 			resetAction();
	// 		}, 3000);
	// 	},
	// });

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
		resolver: zodResolver(organizationUpdateSchema),
		defaultValues,
	});

	async function onSubmit(values: OrganizationFormValues) {
		const payload = getDirtyFields<OrganizationFormValues>(form, values);
		if (payload?.domain) {
			const { data } = await authClient.organization.checkSlug({
				slug: payload.domain,
			});
			if (!data?.status) {
				toast.warning("Domain is already in use");
				return;
			}
			toast.info("Domain has changed. Please re-verify your domain.");
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
				await updateOrganization(supabase, {
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
	}, [updateStatus, updateError, handleReset]);

	useActionToast({
		show: form.formState.isDirty,
		ToastContent,
	});

	const logoUrl = useMemo(
		() => `${form.watch("logo")}?${Date.now()}`,
		[form.watch("logo")],
	);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 w-full max-w-3xl mx-auto px-4 py-8"
			>
				<section className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
					<div className="space-y-2 w-full">
						<Label className="font-semibold text-base">Company Logo</Label>
						<p className="text-muted-foreground text-sm">
							Accepts : PNG, JPG, or SVG.
							<br />
							Max size : 1MB
							<br />
							Recommended dimensions: 200x200 pixels.
						</p>
					</div>
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
				</section>
				<Separator />
				<section className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
					<div className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="name">
							Legal Name
						</Label>
						<FormDescription>Company's registered legal name</FormDescription>
					</div>
					<div className="w-full md:w-1/2">
						<FormInput<OrganizationFormValues> id="name" name="name" />
					</div>
				</section>
				<Separator />
				<section className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
					<div className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="industry">
							Industry
						</Label>
						<FormDescription>Company's industry</FormDescription>
					</div>
					<div className="w-full md:w-1/2">
						<FormInput<OrganizationFormValues> id="industry" name="industry" />
					</div>
				</section>
				<Separator />
				<section className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
					<div className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="domain">
							Domain
						</Label>
						<FormDescription>
							Company's official website domain.
						</FormDescription>
					</div>
					<div className="w-full md:w-1/2">
						<FormInput<OrganizationFormValues> name="domain" id="domain" />
					</div>
				</section>
				{/* <DomainVerification companyId={form.getValues("id") ?? ""} /> */}
				domain verification
				<Separator />
				<section className="flex flex-col w-full gap-4">
					<div className="space-y-2 w-full">
						<Label className="font-semibold text-base" htmlFor="address1">
							Location
						</Label>
						<FormDescription>Company's headquarter address</FormDescription>
					</div>
					<FormInput<OrganizationFormValues>
						name="address1"
						id="address1"
						placeholder="123 Main St"
						label="Address 1"
						isOptional
					/>
					<div className="grid gap-8 md:grid-cols-2">
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

						<FormCountrySelector name="country" id="country" label="Country" />
						<FormTimezoneSelector
							name="timezone"
							id="timezone"
							label="Timezone"
						/>
					</div>
				</section>
				<Separator />
				<section className="flex flex-col w-full gap-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="space-y-2 w-full">
							<Label className="font-semibold text-base">Profile</Label>
							<p className="text-muted-foreground text-sm md:w-3/4">
								Write a detailed profile showcasing your company's mission,
								values, services, and achievements.
							</p>
						</div>
						<div className="flex items-center gap-4 w-full md:w-auto">
							<Link
								href={`https://jobs.staffoptima.co/${company?.domain}`}
								className={buttonVariants({ variant: "secondary" })}
								target="_blank"
							>
								Preview
							</Link>
						</div>
					</div>
					<FormField
						control={form.control}
						name="profile"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="w-full border rounded-md min-h-96 p-4 grid">
										{/* <Editor
											content={field.value ?? ""}
											onChange={(content) => {
												form.setValue("profile", content, {
													shouldDirty: true,
													shouldTouch: true,
												});
											}}
											key={resetKey}
										/> */}
										editor
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</section>
				<button type="submit" ref={formSubmitRef} className="hidden">
					save
				</button>
			</form>
		</Form>
	);
}
