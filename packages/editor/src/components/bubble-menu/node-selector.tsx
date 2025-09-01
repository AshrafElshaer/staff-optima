import { Button } from "@optima/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@optima/ui/components/dropdown-menu";
import type { Editor } from "@tiptap/react";
import {
	CheckSquare,
	ChevronDown,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Minus,
	Quote,
	Text,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface NodeSelectorProps {
	editor: Editor;
	onOpenChange?: (open: boolean) => void;
}

interface NodeOption {
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	command: () => void;
	isActive: () => boolean;
	disabled?: boolean;
}

export function NodeSelector({ editor, onOpenChange }: NodeSelectorProps) {
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

	const options: NodeOption[] = useMemo(
		() => [
			{
				name: "Paragraph",
				icon: Text,
				command: () => editor.chain().focus().setParagraph().run(),
				isActive: () => editor.isActive("paragraph"),
			},
			{
				name: "Heading 1",
				icon: Heading1,
				command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
				isActive: () => editor.isActive("heading", { level: 1 }),
			},
			{
				name: "Heading 2",
				icon: Heading2,
				command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				isActive: () => editor.isActive("heading", { level: 2 }),
			},
			{
				name: "Heading 3",
				icon: Heading3,
				command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				isActive: () => editor.isActive("heading", { level: 3 }),
			},
			{
				name: "Bullet List",
				icon: List,
				command: () => editor.chain().focus().toggleBulletList().run(),
				isActive: () => editor.isActive("bulletList"),
			},
			{
				name: "Numbered List",
				icon: ListOrdered,
				command: () => editor.chain().focus().toggleOrderedList().run(),
				isActive: () => editor.isActive("orderedList"),
			},
			{
				name: "Task List",
				icon: CheckSquare,
				command: () => editor.chain().focus().toggleTaskList().run(),
				isActive: () => editor.isActive("taskList"),
			},
			{
				name: "Blockquote",
				icon: Quote,
				command: () => editor.chain().focus().toggleBlockquote().run(),
				isActive: () => editor.isActive("blockquote"),
			},
			{
				name: "Code Block",
				icon: Code,
				command: () => editor.chain().focus().toggleCodeBlock().run(),
				isActive: () => editor.isActive("codeBlock"),
			},
			{
				name: "Divider",
				icon: Minus,
				command: () => editor.chain().focus().setHorizontalRule().run(),
				isActive: () => false,
			},
		],
		[editor],
	);

	const activeItem = useMemo(
		() => options.find((option) => option.isActive()) ?? options[0],
		[options, editorState], // Now depends on editorState which updates when editor state changes
	);

	const handleItemSelect = useCallback((option: NodeOption) => {
		option.command();
	}, []);

	if (!editor || !activeItem) {
		return null;
	}

	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="gap-2 px-3"
					aria-label="Change text type"
				>
					<activeItem.icon className="size-4" />
					<span className="max-w-[100px] truncate">{activeItem.name}</span>
					<ChevronDown className="size-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-60"
				side="bottom"
				sideOffset={8}
				avoidCollisions={true}
				onCloseAutoFocus={(e) => e.preventDefault()}
				style={{ zIndex: 9999 }}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Turn into
				</DropdownMenuLabel>
				{options.map((option) => (
					<DropdownMenuItem
						key={option.name}
						onSelect={() => handleItemSelect(option)}
						className={option.isActive() ? "bg-accent" : ""}
						disabled={option.disabled}
					>
						<option.icon className="mr-2 size-4" />
						<span>{option.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
