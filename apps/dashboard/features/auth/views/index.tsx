"use client";

import { AnimatePresence, motion } from "motion/react";
import { useQueryStates } from "nuqs";
import { authSearchParams } from "../auth.searchParams";
import { SignIn } from "./sign-in";
import { VerifyOtp } from "./verify-otp";

export function AuthComponent() {
	const [{ activeTab }] = useQueryStates(authSearchParams, {
		shallow: true,
	});

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={activeTab}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.25 }}
				className="w-full grid place-items-center "
			>
				{activeTab === "sign-in" ? (
					<SignIn />
				) : activeTab === "verify-otp" ? (
					<VerifyOtp />
				) : null}
			</motion.div>
		</AnimatePresence>
	);
}
