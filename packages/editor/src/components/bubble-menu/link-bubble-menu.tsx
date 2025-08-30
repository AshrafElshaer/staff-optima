import { Button } from "@optima/ui/components/button";
import { Input } from "@optima/ui/components/inputs/input";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Check, ExternalLink, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface LinkBubbleMenuProps {
	editor: Editor;
}

export function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
	const [url, setUrl] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
		return editor.isActive("link");
	}, []);

	// Update URL when link becomes active
	useEffect(() => {
		if (editor.isActive("link")) {
			const linkAttributes = editor.getAttributes("link");
			setUrl(linkAttributes.href || "");
		}
	}, [editor.state.selection]);

	const handleEdit = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleSave = useCallback(() => {
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		} else {
			editor.chain().focus().unsetLink().run();
		}
		setIsEditing(false);
	}, [editor, url]);

	const handleCancel = useCallback(() => {
		if (editor.isActive("link")) {
			const linkAttributes = editor.getAttributes("link");
			setUrl(linkAttributes.href || "");
		}
		setIsEditing(false);
	}, [editor]);

	const handleRemove = useCallback(() => {
		editor.chain().focus().unsetLink().run();
		setIsEditing(false);
	}, [editor]);

	const handleOpenLink = useCallback(() => {
		if (url) {
			window.open(url, "_blank", "noopener,noreferrer");
		}
	}, [url]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === "Enter") {
				event.preventDefault();
				handleSave();
			} else if (event.key === "Escape") {
				event.preventDefault();
				handleCancel();
			}
		},
		[handleSave, handleCancel],
	);

	if (!editor) {
		return null;
	}

	return (
		<BubbleMenu editor={editor} shouldShow={shouldShow}>
			<div className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
				{isEditing ? (
					<>
						<Input
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Enter URL..."
							className="w-64"
							autoFocus
							aria-label="Link URL"
						/>
						<Button
							size="sm"
							onClick={handleSave}
							aria-label="Save link"
							title="Save link"
						>
							<Check className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCancel}
							aria-label="Cancel editing"
							title="Cancel editing"
						>
							<X className="size-4" />
						</Button>
					</>
				) : (
					<>
						<span className="max-w-xs truncate text-sm text-muted-foreground">
							{url}
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleEdit}
							aria-label="Edit link"
							title="Edit link"
						>
							Edit
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleOpenLink}
							aria-label="Open link in new tab"
							title="Open link in new tab"
						>
							<ExternalLink className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRemove}
							aria-label="Remove link"
							title="Remove link"
						>
							<Trash2 className="size-4" />
						</Button>
					</>
				)}
			</div>
		</BubbleMenu>
	);
}
