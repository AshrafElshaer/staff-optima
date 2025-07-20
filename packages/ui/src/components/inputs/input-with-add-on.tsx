import { BaseInput } from "@optima/ui/components/inputs/base-input";
import { cn } from "@optima/ui/lib/utils";
import type { ComponentProps } from "react";

interface InputWithAddOnProps extends ComponentProps<"input"> {
	addOn: string;
	addOnDirection?: "start" | "end";
	wrapperClassName?: string;
}

export function InputWithAddOn({
	addOn,
	addOnDirection = "start",
	className,
	wrapperClassName,
	...props
}: InputWithAddOnProps) {
	return (
		<div className={cn("relative", wrapperClassName)}>
			<BaseInput
				className={cn(
					"peer w-full",
					addOnDirection === "start" && "ps-16",
					addOnDirection === "end" && "pe-16",
					className,
				)}
				{...props}
			/>
			{addOn && (
				<span
					className={cn(
						"text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center text-sm peer-disabled:opacity-50",
						addOnDirection === "start" && "start-0 ps-3",
						addOnDirection === "end" && "end-0 pe-3",
					)}
				>
					{addOn}
				</span>
			)}
		</div>
	);
}
