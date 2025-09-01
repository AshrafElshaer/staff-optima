import {
	autoUpdate,
	flip,
	offset,
	type Placement,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
} from "@floating-ui/react";
import type { NodeRange, Range } from "@tiptap/core";
import React, { useCallback, useRef } from "react";
import type { FloatingToolbarState } from "./use-floating-toolbar-state";

export interface UseFloatingToolbarOptions {
	state: FloatingToolbarState;
	onOpenChange?: (open: boolean) => void;
}

export function useFloatingToolbar({
	state,
	onOpenChange,
}: UseFloatingToolbarOptions) {
	const { isOpen, editor, placement, offset: offsetValue, padding } = state;

	const virtualElement = useRef<{
		getBoundingClientRect: () => DOMRect;
	} | null>(null);
	const lastSelectionRef = useRef<any>(null);

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

	/** Update virtual element position */
	const updateVirtualElement = useCallback(() => {
		if (!isEditorValid()) return;

		try {
			const { selection } = editor.state;

			// Use stored selection if current selection is empty but we had a valid one
			const selectionToUse =
				selection.empty && lastSelectionRef.current
					? lastSelectionRef.current
					: selection;

			const { ranges } = selectionToUse;

			if (ranges.length === 0) return;

			const from = Math.min(...ranges.map((r: any) => r.$from.pos));
			const to = Math.max(...ranges.map((r: any) => r.$to.pos));

			// Validate positions
			const docSize = editor.state.doc.content.size;
			if (from < 0 || to < 0 || from > docSize || to > docSize) return;

			const start = editor.view.coordsAtPos(from);
			const end = editor.view.coordsAtPos(to);

			if (!start || !end) return;

			// Position at start of selection (you can change this to 'end' if preferred)
			const targetPosition = start; // Use 'end' for end positioning

			virtualElement.current = {
				getBoundingClientRect: () =>
					({
						x: targetPosition.left,
						y: targetPosition.top,
						width: 1, // Minimal width to create a point reference
						height: targetPosition.bottom - targetPosition.top,
						top: targetPosition.top,
						right: targetPosition.left + 1,
						bottom: targetPosition.bottom,
						left: targetPosition.left,
						toJSON: () => ({}),
					}) as DOMRect,
			};

			// Store valid selection for later use
			if (!selection.empty) {
				lastSelectionRef.current = selection;
			}
		} catch (error) {
			console.warn("Error updating virtual element:", error);
		}
	}, [editor, isEditorValid]);

	// Floating UI setup with disabled dismiss when dropdowns are open
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: (open) => {
			// Don't close if we're just losing focus temporarily
			if (!open && onOpenChange) {
				setTimeout(() => onOpenChange(open), 0);
			} else if (onOpenChange) {
				onOpenChange(open);
			}
		},
		middleware: [
			offset(offsetValue),
			flip({
				fallbackPlacements: [
					"top-start",
					"top-end",
					"bottom-start",
					"bottom-end",
				],
				padding,
			}),
			shift({ padding }),
		],
		placement: placement as Placement,
		whileElementsMounted: autoUpdate,
	});

	// Don't dismiss when clicking inside popovers/dropdowns
	const dismiss = useDismiss(context, {
		outsidePress: (event) => {
			// Don't dismiss if clicking on a popover or dropdown
			const target = event.target as Element;
			if (
				target.closest("[data-radix-popper-content-wrapper]") ||
				target.closest('[role="dialog"]') ||
				target.closest('[data-state="open"]')
			) {
				return false;
			}
			return true;
		},
	});

	const { getFloatingProps } = useInteractions([dismiss]);

	// Update reference when selection changes or when opening
	React.useEffect(() => {
		if (isOpen && isEditorValid()) {
			updateVirtualElement();
			if (virtualElement.current) {
				refs.setReference(virtualElement.current);
			}
		}
	}, [
		isOpen,
		editor.state.selection,
		updateVirtualElement,
		refs,
		isEditorValid,
	]);

	// Handle window resize to update virtual element position
	React.useEffect(() => {
		if (!isOpen || !isEditorValid()) return;

		const handleResize = () => {
			updateVirtualElement();
			if (virtualElement.current) {
				refs.setReference(virtualElement.current);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isOpen, updateVirtualElement, refs, isEditorValid]);

	return {
		refs,
		floatingStyles,
		context,
		hidden: !isOpen,
		props: getFloatingProps(),
		clickOutsideRef: refs.setReference,
	};
}
