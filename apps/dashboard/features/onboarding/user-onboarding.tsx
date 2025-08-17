"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabase } from "@optima/supabase/clients/use-supabase";
import { uploadUserAvatar } from "@optima/supabase/utils/upload-file";
import { userInsertSchema } from "@optima/supabase/validations/user.validations";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@optima/ui/components/avatar";
import { Button } from "@optima/ui/components/button";
import {
	type DropzoneOptions,
	FileDropZone,
} from "@optima/ui/components/file-upload-zone";
import { Form } from "@optima/ui/components/form";
import { FormInput, FormPhoneInput } from "@optima/ui/components/form-controls";
import { Icons } from "@optima/ui/components/icons";

import { TextGenerateEffect } from "@optima/ui/components/text-animate";
import { AnimatePresence, motion } from "framer-motion";
import type { CountryCode } from "libphonenumber-js";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useCountdown } from "usehooks-ts";
import type { z } from "zod";
import { authClient } from "@/lib/auth/auth.client";

export function UserOnboarding({ countryCode }: { countryCode: string }) {
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
						className: "flex-grow grid place-content-center w-full  p-4",
					}}
				>
					<TextGenerateEffect
						words="First, let's gather basic information about you."
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
					className="w-full p-4 max-w-lg mx-auto"
				>
					<UserForm countryCode={countryCode} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const baseDropZoneConfig: DropzoneOptions = {
	accept: {
		"image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
	},
	maxSize: 1024 * 1024,
	multiple: false,
};

type UserFormValues = z.infer<typeof userInsertSchema>;

function UserForm({ countryCode }: { countryCode: string }) {
	const { data: session } = authClient.useSession();
	const supabase = useSupabase();

	const router = useRouter();

	const form = useForm<UserFormValues>({
		defaultValues: {
			email: session?.user.email ?? "",
			name: session?.user.name ?? "",
			jobTitle: session?.user.jobTitle ?? "",
			phoneNumber: session?.user.phoneNumber ?? "",
			image: session?.user.image ?? "",
		},
		resolver: zodResolver(userInsertSchema),
	});

	useEffect(() => {
		if (session?.user) {
			form.reset({
				email: session.user.email,
				name: session.user.name,
				jobTitle: session.user.jobTitle ?? "",
				phoneNumber: session.user.phoneNumber ?? "",
				image: session.user.image ?? "",
			});
		}
	}, [session?.user]);

	const userProfileDropZone: DropzoneOptions = {
		...baseDropZoneConfig,
		onDrop: async (acceptedFiles, rejectedFiles) => {
			if (rejectedFiles.length > 0) {
				rejectedFiles.forEach((file) => {
					toast.error(file.errors[0]?.message ?? "Could not upload file");
				});
				return;
			}

			const file = acceptedFiles[0];
			if (!file) {
				toast.error("Could not upload file");
				return;
			}
			toast.promise(
				async () => {
					const url = await uploadUserAvatar(
						supabase,
						session?.user.id ?? "",
						file,
						{
							upsert: true,
						},
					);
					console.log("url", url);
					form.setValue("image", url, {
						shouldDirty: true,
						shouldTouch: true,
					});
				},
				{
					loading: "Uploading file...",
					success: "Avatar uploaded successfully",
					error: (error) => {
						return error.message;
					},
				},
			);
		},
	};

	async function onSubmit(data: UserFormValues) {
		await authClient.updateUser({
			name: data.name,
			jobTitle: data.jobTitle,
			phoneNumber: data.phoneNumber,
			image: data.image,
			fetchOptions: {
				onSuccess: () => {
					router.push("/onboarding/organization");
				},
			},
		});
	}

	useEffect(() => {
		form.reset({
			email: session?.user.email ?? "",
			name: session?.user.name ?? "",
			image: session?.user.image ?? "",
		});
	}, [session?.user]);

	const avatarUrl = useWatch({
		control: form.control,
		name: "image",
	});

	// Add cache-busting parameter
	const avatarUrlWithCacheBust = avatarUrl
		? `${avatarUrl}?t=${Date.now()}`
		: undefined;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-4 relative"
			>
				<div className="flex items-start gap-4">
					<FileDropZone className="w-fit relative" config={userProfileDropZone}>
						<Avatar className="size-20 ">
							<AvatarImage src={avatarUrlWithCacheBust} className="rounded" />
							<AvatarFallback className="rounded text-3xl">
								{form.watch("name")?.split(" ")[0]?.charAt(0)}
								{form.watch("name")?.split(" ")[1]?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					</FileDropZone>
					{avatarUrl && (
						<Button
							variant="destructive"
							className="absolute -top-3 -left-3 rounded-full"
							size="iconXs"
							onClick={() =>
								form.setValue("image", "", {
									shouldDirty: true,
									shouldTouch: true,
								})
							}
							type="button"
						>
							<X className="size-4" />
						</Button>
					)}
					<div className="space-y-2 ">
						<p className=" font-medium">
							Profile picture{" "}
							<span className="text-muted-foreground text-sm">
								( optional )
							</span>
						</p>

						<p className="text-sm text-muted-foreground">
							Max file size: 1MB <br /> Supported formats: PNG, JPEG, GIF, WEBP
						</p>
					</div>
				</div>
				<FormInput<UserFormValues> name="name" label="Full Name" />
				<FormInput<UserFormValues> name="jobTitle" label="Job Title" />
				<FormPhoneInput<UserFormValues>
					name="phoneNumber"
					label="Phone Number"
					countryCode={countryCode as CountryCode}
				/>

				<Button
					size="sm"
					type="submit"
					className="w-full"
					disabled={form.formState.isSubmitting || status === "hasSucceeded"}
				>
					{form.formState.isSubmitting ? (
						<Icons.Loader className="size-4 animate-spin " />
					) : null}
					Continue
				</Button>
			</form>
		</Form>
	);
}
