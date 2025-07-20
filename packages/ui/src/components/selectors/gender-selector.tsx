"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@optima/ui/components/select";
import { cn } from "@optima/ui/lib/utils";

export function GenderSelector({
	value,
	setValue,
}: {
	value: string;
	setValue: (value: string) => void;
}) {
	return (
		<Select value={value} onValueChange={setValue}>
			<SelectTrigger
				className={cn("capitalize w-full", !value && "text-muted-foreground")}
			>
				<SelectValue placeholder="Select a gender" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="male">Male</SelectItem>
				<SelectItem value="female">Female</SelectItem>
				<SelectItem value="other">Other</SelectItem>
			</SelectContent>
		</Select>
	);
}
