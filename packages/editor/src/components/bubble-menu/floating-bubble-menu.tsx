"use client";

import { Separator } from "@optima/ui/components/separator";
import type { Editor } from "@tiptap/react";
import {
	Bold,
	Code,
	Italic,
	PaintBucket,
	Palette,
	Strikethrough,
	Underline,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useComposedRef } from "@/hooks/use-composed-ref";
import { useFloatingToolbar } from "@/hooks/use-floating-toolbar";
import { useFloatingToolbarState } from "@/hooks/use-floating-toolbar-state";
import { Toolbar, ToolbarButton } from "../toolbar";
import { LinkPopover } from "./link-popover";
import { NodeSelector } from "./node-selector";
import { FontColorToolbarButton } from "./text-color-picker";

interface FloatingBubbleMenuProps {
	editor: Editor;
}

export function FloatingBubbleMenu({ editor }: FloatingBubbleMenuProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [storedSelection, setStoredSelection] = useState<
		typeof editor.state.selection | null
	>(null);

	/** Safe editor state check */
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

	/** Popover open/close behavior with error handling */
	const handlePopoverOpenChange = useCallback(
		(open: boolean) => {
			try {
				if (open && isEditorValid()) {
					// Store current selection when opening popover
					setStoredSelection(editor.state.selection);
				} else if (!open && storedSelection && isEditorValid()) {
					// Restore selection when closing popover
					setTimeout(() => {
						try {
							if (isEditorValid() && storedSelection) {
								editor.commands.setTextSelection(storedSelection);
								editor.commands.focus();
								// Clear stored selection after restoring
								setStoredSelection(null);
							}
						} catch (error) {
							console.warn("Error restoring selection:", error);
						}
					}, 10); // Shorter delay for better UX
				}
				setIsPopoverOpen(open);
			} catch (error) {
				console.warn("Error handling popover state change:", error);
				setIsPopoverOpen(false);
			}
		},
		[editor, storedSelection, isEditorValid],
	);

	// Custom floating toolbar state
	const floatingToolbarState = useFloatingToolbarState({
		editor,
		hideToolbar: isPopoverOpen,
		placement: "top",
		offset: 12,
		padding: 12,
	});

	const {
		hidden,
		props: rootProps,
		refs,
		floatingStyles,
	} = useFloatingToolbar({
		state: floatingToolbarState,
		onOpenChange: (open) => {
			// Handle floating toolbar open/close
			if (!open && !isPopoverOpen) {
				// Only fully close if no popovers are open
				setStoredSelection(null);
			}
		},
	});

	const ref = useComposedRef<HTMLDivElement>(refs.setFloating);

	/** Formatting state with error handling */
	const formattingState = useMemo(() => {
		if (!isEditorValid()) {
			return {
				bold: false,
				italic: false,
				underline: false,
				strike: false,
				code: false,
			};
		}

		try {
			return {
				bold: editor.isActive("bold"),
				italic: editor.isActive("italic"),
				underline: editor.isActive("underline"),
				strike: editor.isActive("strike"),
				code: editor.isActive("code"),
			};
		} catch (error) {
			console.warn("Error getting formatting state:", error);
			return {
				bold: false,
				italic: false,
				underline: false,
				strike: false,
				code: false,
			};
		}
	}, [editor.state.selection, isEditorValid]);

	/** Safe formatting commands */
	const createSafeToggleCommand = useCallback(
		(command: string) => () => {
			if (!isEditorValid()) return;

			try {
				switch (command) {
					case "bold":
						editor.chain().focus().toggleBold().run();
						break;
					case "italic":
						editor.chain().focus().toggleItalic().run();
						break;
					case "underline":
						editor.chain().focus().toggleUnderline().run();
						break;
					case "strike":
						editor.chain().focus().toggleStrike().run();
						break;
					case "code":
						editor.chain().focus().toggleCode().run();
						break;
					default:
						console.warn(`Unknown formatting command: ${command}`);
				}
			} catch (error) {
				console.warn(`Error executing ${command} command:`, error);
			}
		},
		[editor, isEditorValid],
	);

	const toggleBold = createSafeToggleCommand("bold");
	const toggleItalic = createSafeToggleCommand("italic");
	const toggleUnderline = createSafeToggleCommand("underline");
	const toggleStrike = createSafeToggleCommand("strike");
	const toggleCode = createSafeToggleCommand("code");

	/** Keyboard handlers */
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			try {
				if (e.key === "Escape") {
					e.preventDefault();
					if (isEditorValid()) {
						editor.commands.focus();
					}
				}
			} catch (error) {
				console.warn("Error handling keyboard event:", error);
			}
		},
		[editor, isEditorValid],
	);

	// Don't render if hidden or editor is invalid
	if (hidden || !isEditorValid()) {
		return null;
	}

	return (
		<Toolbar
			{...rootProps}
			ref={ref}
			style={floatingStyles}
			className="flex items-center gap-1 rounded-lg border bg-muted p-1 shadow-lg"
		>
			<div
				className="flex items-center gap-1 rounded-lg overflow-x-auto scrollbar-hide"
				style={{ maxWidth: "calc(100vw - 40px)" }}
				onKeyDown={handleKeyDown}
				role="toolbar"
				aria-label="Text formatting options"
				onMouseDown={(e) => e.preventDefault()}
			>
				{/* Node type */}
				<div className="flex-shrink-0">
					<NodeSelector
						editor={editor}
						onOpenChange={handlePopoverOpenChange}
					/>
				</div>

				<Separator orientation="vertical" className="h-6 flex-shrink-0" />

				{/* Text styles */}
				<fieldset
					className="flex items-center flex-shrink-0"
					aria-label="Text style"
				>
					<ToolbarButton
						size="sm"
						pressed={formattingState.bold}
						onClick={toggleBold}
						aria-label="Bold (Ctrl+B)"
						tooltip="Bold"
						disabled={!isEditorValid()}
					>
						<Bold className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						size="sm"
						pressed={formattingState.italic}
						onClick={toggleItalic}
						tooltip="Italic"
						aria-label="Italic (Ctrl+I)"
						disabled={!isEditorValid()}
					>
						<Italic className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						size="sm"
						pressed={formattingState.underline}
						onClick={toggleUnderline}
						tooltip="Underline"
						aria-label="Underline (Ctrl+U)"
						disabled={!isEditorValid()}
					>
						<Underline className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						size="sm"
						pressed={formattingState.strike}
						onClick={toggleStrike}
						tooltip="Strikethrough"
						aria-label="Strikethrough"
						disabled={!isEditorValid()}
					>
						<Strikethrough className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						size="sm"
						pressed={formattingState.code}
						onClick={toggleCode}
						aria-label="Inline code"
						tooltip="Inline code"
						disabled={!isEditorValid()}
					>
						<Code className="size-4" />
					</ToolbarButton>
				</fieldset>

				<Separator orientation="vertical" className="h-6 flex-shrink-0" />

				<div className="flex items-center gap-1 flex-shrink-0">
					<FontColorToolbarButton
						editor={editor}
						nodeType="color"
						tooltip="Text Color"
						onOpenChange={handlePopoverOpenChange}
					>
						<Palette className="size-4" />
					</FontColorToolbarButton>
					<FontColorToolbarButton
						editor={editor}
						nodeType="backgroundColor"
						tooltip="Background Color"
						onOpenChange={handlePopoverOpenChange}
					>
						<PaintBucket className="size-4" />
					</FontColorToolbarButton>
				</div>

				<Separator orientation="vertical" className="h-6 flex-shrink-0" />

				<div className="flex-shrink-0">
					<LinkPopover editor={editor} onOpenChange={handlePopoverOpenChange} />
				</div>
			</div>
		</Toolbar>
	);
}
