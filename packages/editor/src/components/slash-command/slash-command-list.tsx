"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@optima/ui/components/command";
import { cn } from "@optima/ui/lib/utils";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	getFilteredItems,
	type SlashCommandItem,
} from "../../extensions/slash-command/suggestions";

interface SlashCommandListProps {
	query: string;
	onSelect: (item: SlashCommandItem) => void;
}

export interface SlashCommandListRef {
	onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SlashCommandList = forwardRef<
	SlashCommandListRef,
	SlashCommandListProps
>(({ query, onSelect }, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [items, setItems] = useState<SlashCommandItem[]>([]);
	const selectedItemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const filteredItems = getFilteredItems(query);
		setItems(filteredItems);
		setSelectedIndex(0);
	}, [query]);

	// Scroll selected item into view
	useEffect(() => {
		if (selectedItemRef.current) {
			selectedItemRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [selectedIndex]);

	const selectItem = (index: number) => {
		const item = items[index];
		if (item) {
			onSelect(item);
		}
	};

	useImperativeHandle(ref, () => ({
		onKeyDown: (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				setSelectedIndex((selectedIndex + 1) % items.length);
				return true;
			}

			if (event.key === "ArrowUp") {
				setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
				return true;
			}

			if (event.key === "Enter") {
				selectItem(selectedIndex);
				return true;
			}

			return false;
		},
	}));

	if (items.length === 0) {
		return (
			<div
				className="bg-popover border rounded-lg shadow-md p-2"
				style={{ width: "200px" }}
			>
				<Command>
					<CommandList>
						<CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
							No commands found.
						</CommandEmpty>
					</CommandList>
				</Command>
			</div>
		);
	}

	return (
		<div
			className="bg-popover border rounded-lg shadow-md p-1 "
			style={{ width: "200px" }}
		>
			<Command>
				<CommandList className="max-h-[300px] overflow-y-auto">
					<CommandGroup>
						{items.map((item, index) => (
							<CommandItem
								key={item.title}
								value={item.title}
								onSelect={() => selectItem(index)}
								onPointerDown={(e) => {
									e.preventDefault();
									selectItem(index);
								}}
								ref={index === selectedIndex ? selectedItemRef : null}
								className={cn(
									"flex items-center gap-2 px-3 py-1 cursor-pointer rounded-md",
									"hover:bg-accent hover:text-accent-foreground",
									index === selectedIndex && "bg-accent text-accent-foreground",
								)}
							>
								<div className="flex items-center justify-center size-6 rounded-md bg-muted">
									<item.icon className="w-4 h-4" />
								</div>
								<div className="flex flex-col items-start">
									<span className="font-medium text-sm">{item.title}</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	);
});

SlashCommandList.displayName = "SlashCommandList";
