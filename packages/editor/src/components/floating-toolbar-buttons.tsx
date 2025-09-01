"use client";

import {
	BoldIcon,
	Code2Icon,
	ItalicIcon,
	StrikethroughIcon,
	UnderlineIcon,
	WandSparklesIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";
import * as React from "react";
import { LinkToolbarButton } from "@/components/link-toolbar-button";
import { MarkToolbarButton } from "@/components/mark-toolbar-button";
import { MoreToolbarButton } from "@/components/more-toolbar-button";
import { SuggestionToolbarButton } from "@/components/suggestion-toolbar-button";
import { ToolbarGroup } from "@/components/toolbar";
import { TurnIntoToolbarButton } from "@/components/turn-into-toolbar-button";
import { AIToolbarButton } from "./ai-toolbar-button";
import { CommentToolbarButton } from "./comment-toolbar-button";
import { InlineEquationToolbarButton } from "./equation-toolbar-button";

export function FloatingToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<>
			{!readOnly && (
				<>
					<ToolbarGroup>
						<AIToolbarButton tooltip="AI commands">
							<WandSparklesIcon />
							Ask AI
						</AIToolbarButton>
					</ToolbarGroup>

					<ToolbarGroup>
						<TurnIntoToolbarButton />

						<MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
							<BoldIcon />
						</MarkToolbarButton>

						<MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
							<ItalicIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.underline}
							tooltip="Underline (⌘+U)"
						>
							<UnderlineIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.strikethrough}
							tooltip="Strikethrough (⌘+⇧+M)"
						>
							<StrikethroughIcon />
						</MarkToolbarButton>

						<MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
							<Code2Icon />
						</MarkToolbarButton>

						<InlineEquationToolbarButton />

						<LinkToolbarButton />
					</ToolbarGroup>
				</>
			)}

			<ToolbarGroup>
				<CommentToolbarButton />
				<SuggestionToolbarButton />

				{!readOnly && <MoreToolbarButton />}
			</ToolbarGroup>
		</>
	);
}
