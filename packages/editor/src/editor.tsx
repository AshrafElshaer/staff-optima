import { Placeholder } from "@tiptap/extensions";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { FloatingBubbleMenu } from "./components/bubble-menu/floating-bubble-menu";
import { defaultExtensions } from "./extensions/default-extensions";
import SlashCommand from "./extensions/slash-command/slash-command";

interface EditorProps {
	content?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	className?: string;
	editable?: boolean;
}

export default function Editor({
	content = "",
	onChange,
	placeholder = "Type '/' for commands...",
	className = "",
	editable = true,
}: EditorProps) {
	const editor = useEditor({
		extensions: [
			...defaultExtensions,
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "paragraph") {
						return placeholder;
					}
					return node.type.name;
				},
			}),
			SlashCommand,
		],
		content,
		editable,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
	});

	return (
		<EditorContext.Provider value={{ editor }}>
			<EditorContent
				editor={editor}
				className={`prose prose-sm max-w-none focus:outline-none p-4 min-h-[200px] ${className}`}
			>
				{editor && <FloatingBubbleMenu editor={editor} />}
			</EditorContent>
		</EditorContext.Provider>
	);
}
