import { type Editor, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import {
	SlashCommandWrapper,
	type SlashCommandWrapperRef,
} from "../../components/slash-command/slash-command-wrapper";

const SlashCommand = Extension.create({
	name: "slash-command",

	addOptions() {
		return {
			suggestion: {
				char: "/",
				startOfLine: false,
				allowSpaces: false,
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor;
					range: { from: number; to: number };
					props: {
						command: (args: {
							editor: Editor;
							range: { from: number; to: number };
							props: Record<string, unknown>;
						}) => void;
					};
				}) => {
					props.command({ editor, range, props });
				},
				render: () => {
					let popup: TippyInstance | null = null;
					let root: Root | null = null;
					let wrapperRef: SlashCommandWrapperRef | null = null;

					return {
						onStart: (props: {
							editor: Editor;
							range: { from: number; to: number };
							query: string;
							clientRect: () => DOMRect;
						}) => {
							const { editor, range, query } = props;

							// Create a container element
							const container = document.createElement("div");
							container.className = "slash-command-container";

							// Create React root
							root = createRoot(container);

							const component = createElement(SlashCommandWrapper, {
								editor,
								range,
								query,
								onClose: () => {
									popup?.hide();
								},
								ref: (ref: SlashCommandWrapperRef) => {
									wrapperRef = ref;
								},
							});

							root.render(component);

							if (!props.clientRect) {
								return;
							}

							const tippyInstances = tippy("body", {
								getReferenceClientRect: props.clientRect,
								appendTo: () => document.body,
								content: container,
								showOnCreate: true,
								interactive: true,
								trigger: "manual",
								placement: "bottom-start",
								hideOnClick: "toggle",
								animation: "shift-away",
								theme: "light",
								maxWidth: "none",
							});
							popup = tippyInstances[0] || null;
						},

						onUpdate: (props: {
							editor: Editor;
							range: { from: number; to: number };
							query: string;
							clientRect: () => DOMRect;
						}) => {
							const { editor, range, query } = props;

							if (root) {
								const component = createElement(SlashCommandWrapper, {
									editor,
									range,
									query,
									onClose: () => {
										popup?.hide();
									},
									ref: (ref: SlashCommandWrapperRef) => {
										wrapperRef = ref;
									},
								});
								root.render(component);
							}

							if (popup && props.clientRect) {
								popup.setProps({
									getReferenceClientRect: props.clientRect,
								});
							}
						},

						onKeyDown: (props: { event: KeyboardEvent }) => {
							// Handle escape to close
							if (props.event.key === "Escape") {
								popup?.hide();
								return true;
							}

							// Delegate arrow keys and enter to our component
							if (
								["ArrowDown", "ArrowUp", "Enter"].includes(props.event.key) &&
								wrapperRef
							) {
								return wrapperRef.handleKeyDown(props.event);
							}

							return false;
						},

						onExit: () => {
							if (root) {
								root.unmount();
								root = null;
							}

							if (popup) {
								popup.destroy();
								popup = null;
							}
						},
					};
				},
			},
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		];
	},
});

export default SlashCommand;
