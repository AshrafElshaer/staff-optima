"use client";

import { Button } from "@optima/ui/components/button";
import { Icons } from "@optima/ui/components/icons";
import { cn } from "@optima/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";
import type { HookActionStatus } from "next-safe-action/hooks";

import * as React from "react";

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 18 18"
		className="text-green-500"
	>
		<title>circle-check-3</title>
		<g
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			stroke="currentColor"
		>
			<circle cx="9" cy="9" r="7.25" />
			<path d="M5.5,9c.863,.867,1.537,1.868,2.1,2.962,1.307-2.491,2.94-4.466,4.9-5.923" />
		</g>
	</svg>
);

type ReactQueryMutationStatus = "idle" | "pending" | "error" | "success";

interface ToastProps {
	state: ReactQueryMutationStatus | HookActionStatus;
	onReset?: () => void;
	onSave?: () => void;
	errorMessage?: string;
}

const saveStates: Record<
	ReactQueryMutationStatus,
	{ icon: React.ReactElement; text: string }
> = {
	idle: {
		icon: <Info className="w-[18px] h-[18px] text-warning" />,
		text: "Unsaved changes",
	},
	pending: {
		icon: (
			<Icons.Loader className="w-[15px] h-[15px] animate-spin text-white" />
		),
		text: "Saving changes...",
	},
	success: {
		icon: <CheckIcon />,
		text: "Changes Saved",
	},
	error: {
		icon: <AlertCircle className="w-[18px] h-[18px] text-destructive" />,
		text: "Error saving changes",
	},
};

function getHookSaveState(
	state: HookActionStatus | ReactQueryMutationStatus,
): "idle" | "pending" | "error" | "success" {
	switch (state) {
		case "executing":
		case "pending":
			return "pending";
		case "hasSucceeded":
		case "success":
			return "success";
		case "hasErrored":
		case "error":
			return "error";
		default:
			return "idle";
	}
}

export function OnChangeToast({
	state: initialState,
	onReset,
	onSave,
	errorMessage,
}: ToastProps) {
	const [state, setState] = React.useState(initialState);

	React.useEffect(() => {
		if (initialState === "executing") {
			setState("executing");
			const timer = setTimeout(() => {
				setState("hasSucceeded");
				const successTimer = setTimeout(() => {
					setState("idle");
				}, 2000);
				return () => clearTimeout(successTimer);
			}, 3000);
			return () => clearTimeout(timer);
		}
		setState(initialState);
	}, [initialState]);

	const currentState = saveStates[getHookSaveState(state)] as {
		icon: React.ReactElement;
		text: string;
	};

	const handleSave = () => {
		if (onSave) {
			onSave();
		}
	};

	return (
		<div className="inline-flex h-10 items-center justify-center gap-4 px-0.5 py-0 bg-[#131316] rounded-full overflow-hidden shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] mx-auto w-full">
			<div className="flex items-center justify-between w-full min-w-[300px] p-0">
				<div className="inline-flex items-center justify-between gap-2 pl-1.5 pr-3 py-0">
					<div>{currentState.icon}</div>
					<AnimatePresence mode="wait">
						<motion.span
							key={state}
							className={cn(
								"leading-5 font-normal whitespace-nowrap text-sm w-full",
								getHookSaveState(state) === "error"
									? "text-destructive"
									: "text-white",
							)}
							initial={{ y: 15, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -15, opacity: 0 }}
							transition={{
								duration: 0.5,
								type: "spring",
							}}
						>
							{getHookSaveState(state) === "error" && errorMessage
								? errorMessage
								: currentState.text}
						</motion.span>
					</AnimatePresence>
				</div>

				{state === "idle" && (
					<div className="inline-flex items-center gap-2 pl-0 pr-px py-0">
						<Button
							variant="ghost"
							className="text-white hover:bg-white/10 hover:text-white rounded-full"
							size="sm"
							onClick={onReset}
						>
							Reset
						</Button>
						<Button className="rounded-full" size="sm" onClick={handleSave}>
							Save
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
