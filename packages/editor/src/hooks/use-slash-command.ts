import type { Editor } from "@tiptap/core";
import { useCallback, useRef, useState } from "react";
import type { SlashCommandListRef } from "../components/slash-command/slash-command-list";
import type { SlashCommandItem } from "../extensions/slash-command/suggestions";

interface UseSlashCommandProps {
	editor: Editor;
	onClose: () => void;
}

export const useSlashCommand = ({ editor, onClose }: UseSlashCommandProps) => {
	const [query, setQuery] = useState("");
	const commandListRef = useRef<SlashCommandListRef>(null);
	const rangeRef = useRef<{ from: number; to: number } | null>(null);

	const handleSelect = useCallback(
		(item: SlashCommandItem) => {
			if (rangeRef.current) {
				item.command(editor, rangeRef.current);
			}
			onClose();
		},
		[editor, onClose],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!commandListRef.current) return false;

			// Let the command list handle navigation and selection
			if (["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
				return commandListRef.current.onKeyDown(event);
			}

			// Handle escape to close
			if (event.key === "Escape") {
				onClose();
				return true;
			}

			return false;
		},
		[onClose],
	);

	const setRange = useCallback((range: { from: number; to: number }) => {
		rangeRef.current = range;
	}, []);

	return {
		query,
		setQuery,
		commandListRef,
		handleSelect,
		handleKeyDown,
		setRange,
	};
};
