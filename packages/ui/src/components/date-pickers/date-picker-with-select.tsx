"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@optima/ui/components/button";
import { Calendar } from "@optima/ui/components/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@optima/ui/components/popover";
import * as React from "react";

interface DatePickerWithSelectProps {
	date?: Date | undefined;
	setDate: (date: Date | undefined) => void;
	children?: React.ReactNode;
	calendarProps?: React.ComponentProps<typeof Calendar>;
}

export function DatePickerWithSelect({
	date,
	setDate,
	children: trigger,
	calendarProps,
}: DatePickerWithSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [dropdown] =
		React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
			"dropdown",
		);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<Button
						variant="secondary"
						id="date"
						className="w-48 justify-between font-normal"
					>
						{date ? date.toLocaleDateString() : "Select date"}
						<HugeiconsIcon icon={Calendar03Icon} />
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-auto overflow-hidden p-0" align="start">
				<Calendar
					{...calendarProps}
					mode="single"
					defaultMonth={date}
					selected={date}
					onSelect={setDate}
					captionLayout={dropdown}
					className="rounded-lg border shadow-sm"
					buttonVariant="secondary"
				/>
			</PopoverContent>
		</Popover>
	);
}
