"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@optima/ui/components/dropdown-menu";
import { cn } from "@optima/ui/lib/utils";
import type { Editor } from "@tiptap/react";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	ChevronDown,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ToolbarButton } from "../toolbar";

interface TextAlignProps {
	editor: Editor;
	onOpenChange?: (open: boolean) => void;
}

interface AlignOption {
	name: string;
	value: "left" | "center" | "right" | "justify";
	icon: React.ComponentType<{ className?: string }>;
	command: () => void;
	isActive: () => boolean;
}

export function TextAlign({ editor, onOpenChange }: TextAlignProps) {
	// Add state to track editor updates
	const [editorState, setEditorState] = useState(0);

	// Listen to editor state changes
	useEffect(() => {
		if (!editor) return;

		const handleUpdate = () => {
			setEditorState((prev) => prev + 1);
		};

		editor.on("selectionUpdate", handleUpdate);
		editor.on("transaction", handleUpdate);

		return () => {
			if (!editor.isDestroyed) {
				editor.off("selectionUpdate", handleUpdate);
				editor.off("transaction", handleUpdate);
			}
		};
	}, [editor]);

	const options: AlignOption[] = useMemo(
		() => [
			{
				name: "Left",
				value: "left",
				icon: AlignLeft,
				command: () => editor.chain().focus().setTextAlign("left").run(),
				isActive: () => editor.isActive({ textAlign: "left" }),
			},
			{
				name: "Center",
				value: "center",
				icon: AlignCenter,
				command: () => editor.chain().focus().setTextAlign("center").run(),
				isActive: () => editor.isActive({ textAlign: "center" }),
			},
			{
				name: "Right",
				value: "right",
				icon: AlignRight,
				command: () => editor.chain().focus().setTextAlign("right").run(),
				isActive: () => editor.isActive({ textAlign: "right" }),
			},
		],
		[editor],
	);

	const activeItem = useMemo(
		() => options.find((option) => option.isActive()) ?? options[0],
		[options, editorState],
	);
	const handleItemSelect = useCallback(
		(option: AlignOption) => {
			console.log("handleItemSelect", option);
			try {
				option.command();
			} catch (error) {
				console.warn("Error executing alignment command:", error);
			}
		},
		[editor],
	);

	// Safe editor state check
	const isEditorValid = useCallback(() => {
		try {
			return !!(
				editor &&
				!editor.isDestroyed &&
				editor.state &&
				editor.view &&
				editor.view.dom
			);
		} catch (error) {
			console.warn("Error checking editor validity:", error);
			return false;
		}
	}, [editor]);

	if (!isEditorValid() || !activeItem) {
		return null;
	}

	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					aria-label="Text alignment"
					tooltip="Text alignment"
					pressed={false}
				>
					<activeItem.icon className="size-4" />
					<ChevronDown className="size-3" />
				</ToolbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="center"
				// className="w-48"
				side="bottom"
				sideOffset={8}
				avoidCollisions={true}
				onCloseAutoFocus={(e) => e.preventDefault()}
				style={{ zIndex: 9999 }}
			>
				{options.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onSelect={() => handleItemSelect(option)}
						className={cn(
							"flex items-center gap-2",
							option.isActive() && "bg-accent",
						)}
					>
						<option.icon className="size-4" />
						<span>{option.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
