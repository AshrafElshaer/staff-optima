"use client";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { cn } from "@optima/ui/lib/utils";

export function HugeIcon({ icon, className, ...props }: HugeiconsIconProps) {
	return (
		<HugeiconsIcon
			className={cn("text-current", className)}
			icon={icon}
			{...props}
			strokeWidth={2}
		/>
	);
}
