"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@optima/ui/components/avatar";
import { Button } from "@optima/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@optima/ui/components/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@optima/ui/components/popover";
import { cn } from "@optima/ui/lib/utils";
import { Flex } from "@radix-ui/themes";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useCompany } from "@/hooks/use-company";

export function MemberSelector({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	const { company } = useCompany();
	const [open, setOpen] = useState(false);

	const selectedMember = company?.members.find(
		(member) => member.user.id === value,
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="secondary"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{selectedMember ? (
						<div className="flex items-center gap-2">
							<Avatar className="size-6">
								<AvatarImage src={selectedMember.user.image} />
								<AvatarFallback>
									{selectedMember.user.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							{selectedMember.user.name}
						</div>
					) : (
						"Select a member..."
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border p-0">
				<Command>
					<CommandInput placeholder="Search members..." className="h-9" />
					<CommandList>
						<CommandEmpty>No member found.</CommandEmpty>
						<CommandGroup>
							{company?.members.map((member) => (
								<CommandItem
									key={member.id}
									value={member.user.id}
									onSelect={(currentValue) => {
										onChange(currentValue === value ? "" : currentValue);
										setOpen(false);
									}}
								>
									<Flex align="center" gap="2">
										<Avatar className="size-6">
											<AvatarImage src={member.user.image} />
											<AvatarFallback>
												{member.user.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										{member.user.name}
									</Flex>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											value === member.id ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
