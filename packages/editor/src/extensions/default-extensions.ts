import { cn } from "@optima/ui/lib/utils";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { TextStyle } from "@tiptap/extension-text-style";
import { BackgroundColor } from "@tiptap/extension-text-style/background-color";
import { Underline } from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";

// const aiHighlight = AIHighlight;
// Configure link extension with proper styling
const tiptapLink = TiptapLink.configure({
	HTMLAttributes: {
		class: cn(
			"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
		),
	},
	openOnClick: false, // Prevent automatic opening to allow bubble menu interaction
});

// Configure text color extension
const textColor = Color.configure({
	types: ["textStyle"],
});

// Configure text highlight extension
const highlight = Highlight.configure({
	HTMLAttributes: {
		class: cn("rounded px-1 py-0.5"),
	},
	multicolor: true,
});

// Configure underline extension
const underline = Underline.configure({
	HTMLAttributes: {
		class: cn("underline underline-offset-2"),
	},
});

// Configure text style extension (required for color)
const textStyle = TextStyle.configure({
	HTMLAttributes: {
		class: cn(""),
	},
});

const backgroundColor = BackgroundColor.configure({
	types: ["textStyle"],
});

// const tiptapImage = TiptapImage.extend({
// 	addProseMirrorPlugins() {
// 		return [
// 			UploadImagesPlugin({
// 				imageClass: cn("opacity-40 rounded-lg border border-stone-200"),
// 			}),
// 		];
// 	},
// }).configure({
// 	allowBase64: true,
// 	HTMLAttributes: {
// 		class: cn("rounded-lg border border-muted"),
// 	},
// });

// const updatedImage = UpdatedImage.configure({
// 	HTMLAttributes: {
// 		class: cn("rounded-lg border border-muted"),
// 	},
// });

const taskList = TaskList.configure({
	HTMLAttributes: {
		class: cn("not-prose pl-2 "),
	},
});
const taskItem = TaskItem.configure({
	HTMLAttributes: {
		class: cn("flex gap-2 items-start my-4"),
	},
	nested: true,
});

const horizontalRule = HorizontalRule.configure({
	HTMLAttributes: {
		class: cn("mt-4 mb-6 border-t border-muted-foreground"),
	},
});

const starterKit = StarterKit.configure({
	bulletList: {
		HTMLAttributes: {
			class: cn("!list-disc not-prose list-outside leading-3 -mt-2"),
		},
	},
	orderedList: {
		HTMLAttributes: {
			class: cn("!list-decimal not-prose list-outside leading-3 -mt-2"),
		},
	},
	listItem: {
		HTMLAttributes: {
			class: cn("leading-normal not-prose -mb-2"),
		},
	},
	codeBlock: {
		HTMLAttributes: {
			class: cn(
				"rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",
			),
		},
	},
	code: {
		HTMLAttributes: {
			class: cn("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
			spellcheck: "false",
		},
	},
	horizontalRule: false,
	dropcursor: {
		color: "#DBEAFE",
		width: 4,
	},
	gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
	// configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
	// common: covers 37 language grammars which should be good enough in most cases
	lowlight,
});

// const youtube = Youtube.configure({
// 	HTMLAttributes: {
// 		class: cn("rounded-lg border border-muted"),
// 	},
// 	inline: false,
// });

// const twitter = Twitter.configure({
// 	HTMLAttributes: {
// 		class: cn("not-prose"),
// 	},
// 	inline: false,
// });

// const mathematics = Mathematics.configure({
// 	HTMLAttributes: {
// 		class: cn("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
// 	},
// 	katexOptions: {
// 		throwOnError: false,
// 	},
// });

// const markdownExtension = MarkdownExtension.configure({
// 	html: true,
// 	tightLists: true,
// 	tightListClass: "tight",
// 	bulletListMarker: "-",
// 	linkify: false,
// 	breaks: false,
// 	transformPastedText: false,
// 	transformCopiedText: false,
// });

// Remove the hardcoded placeholder configuration
// const placeholder = Placeholder.configure({
// 	placeholder: "Type '/' for commands...",
// });

// Export extensions with all formatting capabilities
export const defaultExtensions = [
	starterKit,
	taskList,
	taskItem,
	tiptapLink,
	textStyle, // Required for color functionality
	backgroundColor,
	textColor,
	highlight,
	underline,
	codeBlockLowlight,
	horizontalRule,
];
