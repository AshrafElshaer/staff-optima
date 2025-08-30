import type { Editor } from "@tiptap/core";
import {
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Minus,
	Quote,
	Type,
} from "lucide-react";

export interface SlashCommandItem {
	title: string;
	description: string;
	searchTerms: string[];
	icon: React.ComponentType<{ className?: string }>;
	command: (editor: Editor, range: { from: number; to: number }) => void;
}

export const slashCommandItems: SlashCommandItem[] = [
	{
		title: "Text",
		description: "Just start typing with plain text.",
		searchTerms: ["p", "paragraph", "text"],
		icon: Type,
		command: (editor, range) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.toggleNode("paragraph", "paragraph")
				.run();
		},
	},
	{
		title: "Heading 1",
		description: "Big section heading.",
		searchTerms: ["title", "big", "large", "h1"],
		icon: Heading1,
		command: (editor, range) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 1 })
				.run();
		},
	},
	{
		title: "Heading 2",
		description: "Medium section heading.",
		searchTerms: ["subtitle", "medium", "h2"],
		icon: Heading2,
		command: (editor, range) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 2 })
				.run();
		},
	},
	{
		title: "Heading 3",
		description: "Small section heading.",
		searchTerms: ["subtitle", "small", "h3"],
		icon: Heading3,
		command: (editor, range) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 3 })
				.run();
		},
	},
	{
		title: "Bullet List",
		description: "Create a simple bullet list.",
		searchTerms: ["unordered", "point", "ul"],
		icon: List,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).toggleBulletList().run();
		},
	},
	{
		title: "Numbered List",
		description: "Create a list with numbering.",
		searchTerms: ["ordered", "numbered", "ol"],
		icon: ListOrdered,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).toggleOrderedList().run();
		},
	},
	{
		title: "Quote",
		description: "Capture a quote.",
		searchTerms: ["blockquote", "citation"],
		icon: Quote,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).toggleBlockquote().run();
		},
	},
	{
		title: "Code",
		description: "Capture a code snippet.",
		searchTerms: ["codeblock", "snippet"],
		icon: Code,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
		},
	},
	{
		title: "Divider",
		description: "Visually divide blocks.",
		searchTerms: ["separator", "break", "hr"],
		icon: Minus,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).setHorizontalRule().run();
		},
	},
	{
		title: "Task List",
		description: "Create a task list with checkboxes.",
		searchTerms: ["todo", "task", "check", "checkbox"],
		icon: CheckSquare,
		command: (editor, range) => {
			editor.chain().focus().deleteRange(range).toggleTaskList().run();
		},
	},
];

export const getFilteredItems = (query: string): SlashCommandItem[] => {
	if (!query) return slashCommandItems;

	const lowercaseQuery = query.toLowerCase();
	return slashCommandItems.filter(
		(item) =>
			item.title.toLowerCase().includes(lowercaseQuery) ||
			item.description.toLowerCase().includes(lowercaseQuery) ||
			item.searchTerms.some((term) =>
				term.toLowerCase().includes(lowercaseQuery),
			),
	);
};
