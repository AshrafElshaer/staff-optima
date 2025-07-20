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

interface DatePickerProps {
	date?: Date | undefined;
	setDate: (date: Date | undefined) => void;
	children?: React.ReactNode;
}

export function DatePicker({
	date,
	setDate,
	children: trigger,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

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
					mode="single"
					defaultMonth={date}
					selected={date}
					onSelect={(date) => {
						setDate(date);
						setOpen(false);
					}}
					className="rounded-lg border shadow-sm"
				/>
			</PopoverContent>
		</Popover>
	);
}
