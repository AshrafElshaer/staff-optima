"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabase } from "@optima/supabase/clients/use-supabase";
import { Button } from "@optima/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@optima/ui/components/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@optima/ui/components/form";
import { Icons } from "@optima/ui/components/icons";
import { Input } from "@optima/ui/components/inputs/input";
import { Separator } from "@optima/ui/components/separator";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod/v4";
import { authClient } from "@/lib/auth/auth.client";
import { authSearchParams } from "../auth.searchParams";

const signInSchema = z.object({
	email: z.email({ error: "Invalid email" }),
});

export function SignIn() {
	const [isPending, startTransition] = useTransition();
	const [{ redirectUrl }, setAuthParams] = useQueryStates(authSearchParams, {
		shallow: true,
	});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		try {
			const { data, error } = await authClient.emailOtp.sendVerificationOtp({
				email: values.email,
				type: "sign-in",
			});

			if (error) {
				toast.error(error.message);
			}

			if (data?.success) {
				setAuthParams({ activeTab: "verify-otp", email: values.email });
			}
		} catch {
			toast.error("Unknown error occurred.");
		}
	}

	const signInWith = async (strategy: "google") => {
		await authClient.signIn.social({
			provider: strategy,
			callbackURL: redirectUrl ?? "/",
			newUserCallbackURL: "/onboarding",
		});
	};

	return (
		<div className="w-full max-w-sm space-y-8">
			<CardHeader className="justify-center">
				<Icons.Logo className="size-12 mx-auto mt-8 mb-4" />
				<CardTitle className="text-center">Welcome Back</CardTitle>
				<CardDescription className="text-center">
					Sign in to your account to continue
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											placeholder="example@domain.com"
											startIcon={<Icons.Mail className="size-5" />}
											inputMode="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full"
							type="submit"
							size="sm"
							disabled={form.formState.isSubmitting || isPending}
						>
							{form.formState.isSubmitting && (
								<Icons.Loader className="size-4 animate-spin" />
							)}
							Continue with email
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="flex flex-col  items-start">
				<div className="flex items-center justify-center gap-4 w-full">
					<Button
						variant="secondary"
						size="sm"
						disabled={form.formState.isSubmitting || isPending}
						onClick={() => startTransition(() => signInWith("google"))}
						type="button"
						className="flex-1"
					>
						<FcGoogle className="size-4" />
						Google
					</Button>
					<Button
						variant="secondary"
						size="sm"
						disabled={form.formState.isSubmitting || isPending || true}
						onClick={() => startTransition(() => signInWith("google"))}
						type="button"
						className="flex-1"
					>
						<FaLinkedin className="size-3.5 text-blue-500" />
						LinkedIn
					</Button>
				</div>
				<div className="flex items-center flex-wrap  gap-2 mt-6">
					<p className="text-sm text-secondary-foreground">
						By signing in you agree to our{" "}
						<Button variant="link" className="p-0" type="button">
							Terms of Service
						</Button>
						{" · "}
						Need help?{" "}
						<Button variant="link" className="p-0" type="button">
							Contact Support
						</Button>
					</p>
				</div>
				<div className="flex items-center  gap-2"></div>
			</CardFooter>
		</div>
	);
}
