import {
	autoUpdate,
	FloatingPortal,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
} from "@floating-ui/react";
import { Separator } from "@optima/ui/components/separator";
import { Toggle } from "@optima/ui/components/toggle";
import type { Editor } from "@tiptap/react";
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LinkPopover } from "./link-popover";
import { NodeSelector } from "./node-selector";
import { TextColorPicker } from "./text-color-picker";

interface FloatingBubbleMenuProps {
	editor: Editor;
}

export function FloatingBubbleMenu({ editor }: FloatingBubbleMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [storedSelection, setStoredSelection] = useState<
		typeof editor.state.selection | null
	>(null);

	const virtualElement = useRef<{
		getBoundingClientRect: () => DOMRect;
	} | null>(null);

	// Floating UI setup
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(8), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	});

	const dismiss = useDismiss(context, {
		enabled: !isDropdownOpen,
	});
	const { getFloatingProps } = useInteractions([dismiss]);

	/** Update menu position based on selection */
	const updatePosition = useCallback(() => {
		if (!editor) return;
		const { selection } = editor.state;
		const { ranges, empty } = selection;

		if (empty) {
			setIsOpen(false);
			return;
		}

		const from = Math.min(...ranges.map((r) => r.$from.pos));
		const to = Math.max(...ranges.map((r) => r.$to.pos));

		if (from === to) {
			setIsOpen(false);
			return;
		}

		const start = editor.view.coordsAtPos(from);
		const end = editor.view.coordsAtPos(to);

		virtualElement.current = {
			getBoundingClientRect: () =>
				({
					x: start.left,
					y: start.top,
					width: end.right - start.left,
					height: end.bottom - start.top,
					top: start.top,
					right: end.right,
					bottom: end.bottom,
					left: start.left,
					toJSON: () => ({}),
				}) as DOMRect,
		};
		refs.setReference(virtualElement.current);
	}, [editor, refs]);

	/** Should the menu show at all? */
	const shouldShow = useCallback(() => {
		if (!editor) return false;
		const { selection } = editor.state;

		if (isDropdownOpen) return true;
		if (selection.empty) return false;
		if (editor.isActive("codeBlock")) return false;
		if (editor.isActive("image") || editor.isActive("video")) return false;

		return true;
	}, [editor, isDropdownOpen]);

	/** Sync with editor events */
	useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = () => {
			const visible = shouldShow();
			if (visible) {
				updatePosition();
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		editor.on("selectionUpdate", handleSelectionUpdate);
		editor.on("transaction", handleSelectionUpdate);

		const handleBlur = () => {
			if (!isDropdownOpen) {
				setTimeout(() => {
					if (!editor.isFocused) setIsOpen(false);
				}, 100);
			}
		};
		editor.on("blur", handleBlur);

		// Initial check
		handleSelectionUpdate();

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
			editor.off("transaction", handleSelectionUpdate);
			editor.off("blur", handleBlur);
		};
	}, [editor, shouldShow, updatePosition, isDropdownOpen]);

	/** Dropdown open/close behavior */
	const handleDropdownOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				setStoredSelection(editor.state.selection);
			} else if (storedSelection) {
				setTimeout(() => {
					editor.commands.setTextSelection(storedSelection);
					editor.commands.focus();
				}, 0);
			}
			setIsDropdownOpen(open);
		},
		[editor, storedSelection],
	);

	/** Formatting state */
	const formattingState = useMemo(
		() => ({
			bold: editor.isActive("bold"),
			italic: editor.isActive("italic"),
			underline: editor.isActive("underline"),
			strike: editor.isActive("strike"),
			code: editor.isActive("code"),
		}),
		[editor.state.selection],
	);

	/** Keyboard handlers */
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				setIsOpen(false);
				editor.commands.focus();
			}
		},
		[editor],
	);

	// Formatting commands
	const toggleBold = useCallback(
		() => editor.chain().focus().toggleBold().run(),
		[editor],
	);
	const toggleItalic = useCallback(
		() => editor.chain().focus().toggleItalic().run(),
		[editor],
	);
	const toggleUnderline = useCallback(
		() => editor.chain().focus().toggleUnderline().run(),
		[editor],
	);
	const toggleStrike = useCallback(
		() => editor.chain().focus().toggleStrike().run(),
		[editor],
	);
	const toggleCode = useCallback(
		() => editor.chain().focus().toggleCode().run(),
		[editor],
	);

	return (
		<FloatingPortal>
			{isOpen && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className="z-[9999]"
					{...getFloatingProps()}
				>
					<div
						className="flex items-center gap-1 rounded-lg border bg-muted p-1 shadow-lg overflow-x-auto"
						style={{ maxWidth: "calc(100vw - 32px)" }}
						onKeyDown={handleKeyDown}
						role="toolbar"
						aria-label="Text formatting options"
						onMouseDown={(e) => e.preventDefault()}
					>
						{/* Node type */}
						<NodeSelector
							editor={editor}
							onOpenChange={handleDropdownOpenChange}
						/>

						<Separator orientation="vertical" className="h-6" />

						{/* Text styles */}
						<fieldset className="flex items-center" aria-label="Text style">
							<Toggle
								size="sm"
								pressed={formattingState.bold}
								onPressedChange={toggleBold}
								aria-label="Bold (Ctrl+B)"
							>
								<Bold className="size-4" />
							</Toggle>
							<Toggle
								size="sm"
								pressed={formattingState.italic}
								onPressedChange={toggleItalic}
								aria-label="Italic (Ctrl+I)"
							>
								<Italic className="size-4" />
							</Toggle>
							<Toggle
								size="sm"
								pressed={formattingState.underline}
								onPressedChange={toggleUnderline}
								aria-label="Underline (Ctrl+U)"
							>
								<Underline className="size-4" />
							</Toggle>
							<Toggle
								size="sm"
								pressed={formattingState.strike}
								onPressedChange={toggleStrike}
								aria-label="Strikethrough"
							>
								<Strikethrough className="size-4" />
							</Toggle>
							<Toggle
								size="sm"
								pressed={formattingState.code}
								onPressedChange={toggleCode}
								aria-label="Inline code"
							>
								<Code className="size-4" />
							</Toggle>
						</fieldset>

						<Separator orientation="vertical" className="h-6" />

						<TextColorPicker
							editor={editor}
							onOpenChange={handleDropdownOpenChange}
						/>

						<Separator orientation="vertical" className="h-6" />

						<LinkPopover
							editor={editor}
							onOpenChange={handleDropdownOpenChange}
						/>
					</div>
				</div>
			)}
		</FloatingPortal>
	);
}
