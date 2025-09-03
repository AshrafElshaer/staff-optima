"use client";
import { Button } from "@optima/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@optima/ui/components/card";
import { Icons } from "@optima/ui/components/icons";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@optima/ui/components/inputs";
import { cn } from "@optima/ui/lib/utils";
import { Heading, Strong, Text } from "@radix-ui/themes";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountdown } from "usehooks-ts";
import { authClient } from "@/lib/auth/auth.client";
import { authSearchParams } from "../auth.searchParams";

export function VerifyOtp() {
	const router = useRouter();

	const [{ email, redirectUrl }, setAuthParams] = useQueryStates(
		authSearchParams,
		{
			shallow: true,
		},
	);
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);

	const [
		resendTimer,
		{ resetCountdown: resetResendTimer, startCountdown: startResendTimer },
	] = useCountdown({
		countStart: 59,
		intervalMs: 1000,
	});

	const [isError, setIsError] = useState(false);

	useEffect(() => {
		startResendTimer();
	}, [startResendTimer]);

	async function resendSignInCode() {
		setIsResending(true);
		try {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email: email,
				type: "sign-in",
			});

			if (error) {
				toast.error(error.message);
			}
		} catch (_error) {
			toast.error("An unknown error occurred");
		} finally {
			setIsResending(false);
			resetResendTimer();
			startResendTimer();
		}
	}

	async function SignInWithCode(code: string) {
		try {
			setIsVerifying(true);
			// Use the code provided by the user and attempt verification
			await authClient.signIn.emailOtp({
				email: email,
				otp: code,
				fetchOptions: {
					onError(error) {
						toast.error(error.error.message);
					},
					onSuccess() {
						router.push(redirectUrl ?? "/");
					},
				},
			});
		} catch {
			toast.error("An unknown error occurred");
			return;
		} finally {
			setIsVerifying(false);
		}
	}

	async function onComplete(code: string) {
		await SignInWithCode(code);
	}

	return (
		<Card className="flex flex-col items-center max-w-sm w-full mx-auto pt-6 ">
			<CardHeader className="flex flex-col  items-center w-full">
				<CardTitle>Check your email</CardTitle>
				<CardDescription>
					We&apos;ve sent a one time pass code to{" "}
				</CardDescription>
				<CardDescription className="text-foreground">
					<Strong>{email}</Strong>
				</CardDescription>
				<Button
					className="text-secondary-foreground"
					size="sm"
					onClick={() => {
						setAuthParams({
							email: null,
							activeTab: "sign-in",
						});
					}}
					variant="secondary"
				>
					Wrong email --&gt; change it
				</Button>
			</CardHeader>
			<CardContent className="">
				<Heading
					as="h2"
					size="3"
					className=" font-semibold text-center mb-6"
					mb="6"
				>
					Enter the pass code to sign in
				</Heading>
				<InputOTP
					// eslint-disable-next-line jsx-a11y/no-autofocus -- This is an OTP input field
					autoFocus
					maxLength={6}
					onComplete={onComplete}
					pattern={REGEXP_ONLY_DIGITS}
					onChange={() => {
						if (isError) {
							setIsError(false);
						}
					}}
					containerClassName={cn(isError && "animate-shake")}
				>
					<InputOTPGroup>
						<InputOTPSlot
							index={0}
							aria-invalid={isError}
							className="bg-accent"
						/>
						<InputOTPSlot
							index={1}
							aria-invalid={isError}
							className="bg-accent"
						/>
						<InputOTPSlot
							index={2}
							aria-invalid={isError}
							className="bg-accent"
						/>
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot
							index={3}
							aria-invalid={isError}
							className="bg-accent"
						/>
						<InputOTPSlot
							index={4}
							aria-invalid={isError}
							className="bg-accent"
						/>
						<InputOTPSlot
							index={5}
							aria-invalid={isError}
							className="bg-accent"
						/>
					</InputOTPGroup>
				</InputOTP>
			</CardContent>
			<CardFooter className="w-full grid px-7 ">
				<Button
					disabled={isVerifying || resendTimer !== 0 || isResending}
					onClick={resendSignInCode}
					variant="secondary"
					className="w-full"
				>
					<AnimatePresence initial={false} mode="wait">
						{isVerifying ? (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								initial={{ opacity: 0, y: 10 }}
								key="verifying-otp"
								transition={{ duration: 0.2 }}
								className="flex items-center justify-center w-full"
							>
								<Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
								Verifying Pass code ...
							</motion.div>
						) : isResending ? (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								className="flex items-center justify-center w-full"
								exit={{ opacity: 0, y: -10 }}
								initial={{ opacity: 0, y: 10 }}
								key="resending-passcode"
								transition={{ duration: 0.2 }}
							>
								<Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
								Resending Pass Code ...
							</motion.div>
						) : resendTimer !== 0 ? (
							<motion.span
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								initial={{ opacity: 0, y: 10 }}
								key="resend-timer"
								transition={{ duration: 0.2 }}
							>
								{`Resend Pass code in ${resendTimer}s`}
							</motion.span>
						) : (
							<motion.span
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								initial={{ opacity: 0, y: 10 }}
								key="resend-passcode"
								transition={{ duration: 0.2 }}
							>
								Resend Pass code
							</motion.span>
						)}
					</AnimatePresence>
				</Button>
			</CardFooter>
		</Card>
	);
}
