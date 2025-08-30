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
import { Button } from "@optima/ui/components/button";
import { Separator } from "@optima/ui/components/separator";
import { Toggle } from "@optima/ui/components/toggle";
import { type Editor, useCurrentEditor } from "@tiptap/react";
import {
	Bold,
	Code,
	Italic,
	Link,
	Strikethrough,
	Underline,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LinkBubbleMenu } from "./link-bubble-menu";
import { NodeSelector } from "./node-selector";
import { TextColorPicker } from "./text-color-picker";

interface FloatingBubbleMenuProps {
	editor: Editor;
}

export function FloatingBubbleMenu({ editor }: FloatingBubbleMenuProps) {
	const { selection } = editor.state;
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const virtualElement = useRef<{
		getBoundingClientRect: () => DOMRect;
	} | null>(null);

	// Store the current selection when dropdown opens
	const [storedSelection, setStoredSelection] = useState<
		typeof editor.state.selection | null
	>(null);

	// Set up floating UI
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [
			offset(8),
			flip({
				fallbackPlacements: [
					"top",
					"bottom",
					"top-start",
					"top-end",
					"bottom-start",
					"bottom-end",
				],
			}),
			shift({ padding: 16 }),
		],
		whileElementsMounted: autoUpdate,
	});

	const dismiss = useDismiss(context, {
		enabled: !isDropdownOpen && selection.from !== selection.to, // Don't dismiss when dropdown is open or no selection
	});

	const { getFloatingProps } = useInteractions([dismiss]);

	// Update virtual element position based on selection
	const updatePosition = useCallback(() => {
		if (!editor) return;

		const { selection } = editor.state;
		const { ranges } = selection;
		const from = Math.min(...ranges.map((range) => range.$from.pos));
		const to = Math.max(...ranges.map((range) => range.$to.pos));

		if (from === to) {
			setIsOpen(false);
			return;
		}

		const start = editor.view.coordsAtPos(from);
		const end = editor.view.coordsAtPos(to);

		// Create a virtual element representing the selection
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

	// Check if bubble menu should be visible
	const shouldShow = useCallback(() => {
		if (!editor) return false;

		const { selection } = editor.state;
		const { empty } = selection;

		// Always show if dropdown is open, even if selection changes
		if (isDropdownOpen) {
			return true;
		}

		// Don't show if selection is empty
		if (empty) return false;

		// Don't show if we're in a code block
		if (editor.isActive("codeBlock")) return false;

		// Don't show for certain node types
		const isInvalidNodeType =
			editor.isActive("image") || editor.isActive("video");
		if (isInvalidNodeType) return false;

		return true;
	}, [editor, isDropdownOpen]);

	// Update position and visibility on selection change
	useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = () => {
			const show = shouldShow();

			if (show) {
				updatePosition();
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		// Initial check
		handleSelectionUpdate();

		// Listen to editor updates
		editor.on("selectionUpdate", handleSelectionUpdate);
		editor.on("transaction", handleSelectionUpdate);

		// Handle editor blur to immediately clear selection and close menu
		const handleBlur = () => {
			// Only clear selection if no dropdown is open
			if (!isDropdownOpen) {
				// Clear the selection immediately when editor loses focus
				setTimeout(() => {
					if (!editor.isFocused) {
						editor.commands.blur();
						setIsOpen(false);
					}
				}, 0);
			}
		};

		editor.on("blur", handleBlur);

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
			editor.off("transaction", handleSelectionUpdate);
			editor.off("blur", handleBlur);
		};
	}, [editor, shouldShow, updatePosition, isDropdownOpen]);

	// Handle dropdown state changes
	const handleDropdownOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				// Store current selection when dropdown opens
				setStoredSelection(editor.state.selection);
				// Prevent the editor from losing focus
				setTimeout(() => {
					if (refs.floating.current) {
						refs.floating.current.focus();
					}
				}, 0);
			} else {
				// Restore selection when dropdown closes
				if (storedSelection) {
					setTimeout(() => {
						editor.commands.setTextSelection(storedSelection);
						editor.commands.focus();
					}, 0);
				}
			}
			setIsDropdownOpen(open);
		},
		[editor, storedSelection, refs.floating],
	);

	// Memoize formatting state for performance
	const formattingState = useMemo(
		() => ({
			bold: editor.isActive("bold"),
			italic: editor.isActive("italic"),
			underline: editor.isActive("underline"),
			strike: editor.isActive("strike"),
			code: editor.isActive("code"),
			link: editor.isActive("link"),
		}),
		[editor.state.selection],
	);

	// Handle keyboard shortcuts
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (!editor) return;

			// Prevent bubbling for certain keys
			if (event.key === "Escape") {
				event.preventDefault();
				setIsOpen(false);
				editor.commands.focus();
			}
		},
		[editor],
	);

	// Memoized toggle handlers
	const toggleBold = useCallback(() => {
		editor.chain().focus().toggleBold().run();
	}, [editor]);

	const toggleItalic = useCallback(() => {
		editor.chain().focus().toggleItalic().run();
	}, [editor]);

	const toggleUnderline = useCallback(() => {
		editor.chain().focus().toggleUnderline().run();
	}, [editor]);

	const toggleStrike = useCallback(() => {
		editor.chain().focus().toggleStrike().run();
	}, [editor]);

	const toggleCode = useCallback(() => {
		editor.chain().focus().toggleCode().run();
	}, [editor]);

	const handleLinkClick = useCallback(() => {
		const url = window.prompt("Enter URL:");
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	}, [editor]);

	if (!editor || !isOpen) {
		return (
			<>
				{/* Separate Link Bubble Menu for editing existing links */}
				<LinkBubbleMenu editor={editor} />
			</>
		);
	}

	return (
		<>
			<FloatingPortal>
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className="z-[9999]"
					{...getFloatingProps()}
				>
					<div
						className="flex items-center gap-1 rounded-lg border bg-muted p-1 shadow-lg overflow-x-auto"
						style={{
							maxWidth: "calc(100vw - 32px)",
						}}
						onKeyDown={handleKeyDown}
						role="toolbar"
						aria-label="Text formatting options"
						onMouseDown={(e) => {
							// Prevent default for all interactions to maintain selection
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						{/* Node Type Selector */}
						<NodeSelector
							editor={editor}
							onOpenChange={handleDropdownOpenChange}
						/>

						<Separator orientation="vertical" className="h-6" />

						{/* Basic Formatting */}
						<fieldset className="flex items-center" aria-label="Text style">
							<Toggle
								size="sm"
								pressed={formattingState.bold}
								onPressedChange={toggleBold}
								aria-label="Bold (Ctrl+B)"
								title="Bold (Ctrl+B)"
								onMouseDown={(e) => e.stopPropagation()}
							>
								<Bold className="size-4" />
							</Toggle>

							<Toggle
								size="sm"
								pressed={formattingState.italic}
								onPressedChange={toggleItalic}
								aria-label="Italic (Ctrl+I)"
								title="Italic (Ctrl+I)"
							>
								<Italic className="size-4" />
							</Toggle>

							<Toggle
								size="sm"
								pressed={formattingState.underline}
								onPressedChange={toggleUnderline}
								aria-label="Underline (Ctrl+U)"
								title="Underline (Ctrl+U)"
							>
								<Underline className="size-4" />
							</Toggle>

							<Toggle
								size="sm"
								pressed={formattingState.strike}
								onPressedChange={toggleStrike}
								aria-label="Strikethrough"
								title="Strikethrough"
							>
								<Strikethrough className="size-4" />
							</Toggle>

							<Toggle
								size="sm"
								pressed={formattingState.code}
								onPressedChange={toggleCode}
								aria-label="Inline code"
								title="Inline code"
							>
								<Code className="size-4" />
							</Toggle>
						</fieldset>

						<Separator orientation="vertical" className="h-6" />

						{/* Text Color */}
						<TextColorPicker
							editor={editor}
							onOpenChange={handleDropdownOpenChange}
						/>

						<Separator orientation="vertical" className="h-6" />

						{/* Link */}
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLinkClick}
							className={formattingState.link ? "bg-accent" : ""}
							aria-label="Add or edit link"
							title="Add or edit link"
						>
							<Link className="size-4" />
						</Button>
					</div>
				</div>
			</FloatingPortal>

			{/* Separate Link Bubble Menu for editing existing links */}
			<LinkBubbleMenu editor={editor} />
		</>
	);
}
