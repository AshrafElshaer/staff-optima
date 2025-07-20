"use client";

import { Alert01Icon, AlertCircleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";

import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			icons={{
				success: <CheckCircleIcon className="w-4 h-4 text-success" />,
				warning: (
					<HugeiconsIcon
						icon={Alert01Icon}
						strokeWidth={2}
						className="w-4 h-4 text-warning"
					/>
				),
				error: (
					<HugeiconsIcon
						icon={AlertCircleFreeIcons}
						strokeWidth={2}
						className="w-4 h-4 text-destructive"
					/>
				),
				info: (
					<HugeiconsIcon
						icon={AlertCircleFreeIcons}
						strokeWidth={2}
						className="w-4 h-4 text-primary"
					/>
				),
			}}
			{...props}
		/>
	);
};

export { Toaster };
