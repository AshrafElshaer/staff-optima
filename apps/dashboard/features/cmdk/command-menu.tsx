"use client";

import { Button } from "@optima/ui/components/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@optima/ui/components/command";
import { useSidebar } from "@optima/ui/components/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@optima/ui/components/tooltip";
import { cn } from "@optima/ui/lib/utils";
import {
	Calculator,
	Calendar,
	CreditCard,
	SearchIcon,
	Settings,
	Smile,
	Sparkles,
	User,
} from "lucide-react";
import * as React from "react";

export function CommandMenu() {
	const [open, setOpen] = React.useState(false);
	const { isMobile, toggleSidebar, setOpenMobile, state } = useSidebar();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="secondary"
							size="sm"
							className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80"
							onClick={() => setOpen(true)}
						>
							<SearchIcon />
							{state !== "collapsed" || isMobile ? (
								<>
									Quick Search
									<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded  px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100 ml-auto">
										⌘K
									</kbd>
								</>
							) : null}
						</Button>
					</TooltipTrigger>
					<TooltipContent
						side="right"
						align="center"
						className={cn(
							state === "expanded" && "hidden",
							isMobile && "hidden",
						)}
					>
						<p>Quick Search</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="scrollbar-hide h-full">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Calendar />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<Calculator />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<User />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
