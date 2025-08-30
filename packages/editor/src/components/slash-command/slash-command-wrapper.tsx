"use client";

import type { Editor } from "@tiptap/core";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useSlashCommand } from "../../hooks/use-slash-command";
import { SlashCommandList } from "./slash-command-list";

interface SlashCommandWrapperProps {
	editor: Editor;
	range: { from: number; to: number };
	query: string;
	onClose: () => void;
}

export interface SlashCommandWrapperRef {
	handleKeyDown: (event: KeyboardEvent) => boolean;
}

export const SlashCommandWrapper = forwardRef<
	SlashCommandWrapperRef,
	SlashCommandWrapperProps
>(({ editor, range, query: initialQuery, onClose }, ref) => {
	const {
		query,
		setQuery,
		commandListRef,
		handleSelect,
		handleKeyDown,
		setRange,
	} = useSlashCommand({ editor, onClose });

	useEffect(() => {
		setQuery(initialQuery);
	}, [initialQuery, setQuery]);

	useEffect(() => {
		setRange(range);
	}, [range, setRange]);

	useImperativeHandle(ref, () => ({
		handleKeyDown: (event: KeyboardEvent) => {
			return handleKeyDown(event);
		},
	}));

	return (
		<SlashCommandList
			ref={commandListRef}
			query={query}
			onSelect={handleSelect}
		/>
	);
});

SlashCommandWrapper.displayName = "SlashCommandWrapper";
