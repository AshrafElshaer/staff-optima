import type { Editor } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";

export interface FloatingToolbarStateOptions {
	editor: Editor;
	hideToolbar?: boolean;
	placement?:
		| "top"
		| "bottom"
		| "top-start"
		| "top-end"
		| "bottom-start"
		| "bottom-end";
	offset?: number;
	padding?: number;
}

export interface FloatingToolbarState {
	isOpen: boolean;
	shouldShow: boolean;
	editor: Editor;
	placement: string;
	offset: number;
	padding: number;
}

export function useFloatingToolbarState({
	editor,
	hideToolbar = false,
	placement = "top-start", // Changed from "top" to "top-start"
	offset: offsetValue = 12,
	padding = 12,
}: FloatingToolbarStateOptions): FloatingToolbarState {
	const [isOpen, setIsOpen] = useState(false);
	const [hasSelection, setHasSelection] = useState(false);

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

	/** Check if we have a valid text selection */
	const checkSelection = useCallback(() => {
		if (!isEditorValid()) return false;

		try {
			const { selection } = editor.state;

			// Check for valid text selection
			if (!selection || selection.empty) return false;

			// Don't show in code blocks
			if (editor.isActive("codeBlock")) return false;

			// Don't show for media elements
			if (editor.isActive("image") || editor.isActive("video")) return false;

			return true;
		} catch (error) {
			console.warn("Error checking selection:", error);
			return false;
		}
	}, [editor, isEditorValid]);

	/** Should the toolbar show - considers both selection and hideToolbar flag */
	const shouldShow = useCallback(() => {
		// If hideToolbar is true, keep toolbar open if we had a selection
		// This prevents closing when dropdowns open
		if (hideToolbar && hasSelection) return true;

		// Otherwise check current selection
		return checkSelection();
	}, [hideToolbar, hasSelection, checkSelection]);

	/** Update toolbar visibility */
	useEffect(() => {
		if (!isEditorValid()) return;

		const handleUpdate = () => {
			try {
				const hasValidSelection = checkSelection();
				setHasSelection(hasValidSelection);

				// Show toolbar if we should show it
				const visible = shouldShow();
				setIsOpen(visible);
			} catch (error) {
				console.warn("Error updating toolbar visibility:", error);
				setIsOpen(false);
				setHasSelection(false);
			}
		};

		const handleBlur = () => {
			try {
				// Only hide on blur if no dropdowns are open
				if (!hideToolbar) {
					setTimeout(() => {
						if (isEditorValid() && !editor.isFocused) {
							setIsOpen(false);
							setHasSelection(false);
						}
					}, 150); // Longer delay to prevent flashing
				}
			} catch (error) {
				console.warn("Error handling blur:", error);
			}
		};

		const handleDestroy = () => {
			setIsOpen(false);
			setHasSelection(false);
		};

		try {
			editor.on("selectionUpdate", handleUpdate);
			editor.on("transaction", handleUpdate);
			editor.on("blur", handleBlur);
			editor.on("destroy", handleDestroy);

			// Initial check
			handleUpdate();
		} catch (error) {
			console.warn("Error setting up toolbar state listeners:", error);
		}

		return () => {
			try {
				if (editor && !editor.isDestroyed) {
					editor.off("selectionUpdate", handleUpdate);
					editor.off("transaction", handleUpdate);
					editor.off("blur", handleBlur);
					editor.off("destroy", handleDestroy);
				}
			} catch (error) {
				console.warn("Error cleaning up toolbar state listeners:", error);
			}
		};
	}, [editor, shouldShow, checkSelection, hideToolbar, isEditorValid]);

	return {
		isOpen,
		shouldShow: shouldShow(),
		editor,
		placement,
		offset: offsetValue,
		padding,
	};
}
