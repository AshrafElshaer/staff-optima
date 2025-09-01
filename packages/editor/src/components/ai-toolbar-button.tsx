"use client";

import { ToolbarButton } from "@/components/toolbar";

import { AIChatPlugin } from "@platejs/ai/react";
import { useEditorPlugin } from "platejs/react";
import type * as React from "react";

export function AIToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>,
) {
	const { api } = useEditorPlugin(AIChatPlugin);

	return (
		<ToolbarButton
			{...props}
			onClick={() => {
				api.aiChat.show();
			}}
			onMouseDown={(e) => {
				e.preventDefault();
			}}
		/>
	);
}
