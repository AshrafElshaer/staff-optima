import { Button } from "@optima/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@optima/ui/components/dropdown-menu";
import type { Editor } from "@tiptap/react";
import { Palette } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface TextColorPickerProps {
	editor: Editor;
	onOpenChange?: (open: boolean) => void;
}

const colors = [
	{ name: "Default", value: "", class: "text-foreground" },
	{ name: "Gray", value: "#6B7280", class: "text-gray-500" },
	{ name: "Red", value: "#EF4444", class: "text-red-500" },
	{ name: "Orange", value: "#F97316", class: "text-orange-500" },
	{ name: "Yellow", value: "#EAB308", class: "text-yellow-500" },
	{ name: "Green", value: "#22C55E", class: "text-green-500" },
	{ name: "Blue", value: "#3B82F6", class: "text-blue-500" },
	{ name: "Purple", value: "#A855F7", class: "text-purple-500" },
	{ name: "Pink", value: "#EC4899", class: "text-pink-500" },
];

const backgroundColors = [
	{ name: "Default", value: "", class: "bg-transparent" },
	{ name: "Gray", value: "#6B7280", class: "bg-gray-500" },
	{ name: "Red", value: "#EF4444", class: "bg-red-500" },
	{ name: "Orange", value: "#F97316", class: "bg-orange-500" },
	{ name: "Yellow", value: "#EAB308", class: "bg-yellow-500" },
	{ name: "Green", value: "#22C55E", class: "bg-green-500" },
	{ name: "Blue", value: "#3B82F6", class: "bg-blue-500" },
	{ name: "Purple", value: "#A855F7", class: "bg-purple-500" },
	{ name: "Pink", value: "#EC4899", class: "bg-pink-500" },
];

export function TextColorPicker({
	editor,
	onOpenChange,
}: TextColorPickerProps) {
	// Make active colors reactive to editor state changes
	const activeColors = useMemo(
		() => ({
			textColor: editor.getAttributes("textStyle").color,
			backgroundColor: editor.getAttributes("background").color,
		}),
		[editor.state.selection],
	);

	const [activeColorsState, setActiveColorsState] = useState<{
		textColor: string;
		backgroundColor: string;
	}>({
		textColor: editor.getAttributes("textStyle").color,
		backgroundColor: editor.getAttributes("background").color,
	});
	const setTextColor = useCallback(
		(color: string) => {
			if (color === "") {
				setActiveColorsState((prev) => ({ ...prev, textColor: "" }));
				editor.chain().focus().unsetColor().run();
			} else {
				setActiveColorsState((prev) => ({ ...prev, textColor: color }));
				editor.chain().focus().setColor(color).run();
			}
		},
		[editor],
	);

	const setBackgroundColor = useCallback(
		(color: string) => {
			if (color === "") {
				setActiveColorsState((prev) => ({ ...prev, backgroundColor: "" }));
				editor.chain().focus().unsetBackgroundColor().run();
			} else {
				setActiveColorsState((prev) => ({ ...prev, backgroundColor: color }));
				editor.chain().focus().setBackgroundColor(color).run();
			}
		},
		[editor],
	);

	if (!editor) {
		return null;
	}

	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					aria-label="Text color"
					title="Text color"
				>
					<Palette className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-48"
				side="bottom"
				sideOffset={8}
				align="end"
				avoidCollisions={true}
				onCloseAutoFocus={(e) => e.preventDefault()}
				style={{ zIndex: 9999 }}
			>
				<div className="p-2 space-y-2">
					<DropdownMenuLabel className="px-0 text-muted-foreground flex items-center justify-between">
						Text Color{" "}
						<div
							className="size-3 rounded-sm"
							style={{ backgroundColor: activeColorsState.textColor }}
						/>
					</DropdownMenuLabel>

					<div className="flex flex-wrap gap-2">
						{colors.map((color) => (
							<button
								key={color.name}
								type="button"
								onClick={() => setTextColor(color.value)}
								className="flex size-6 rounded items-center justify-center border hover:bg-accent"
								style={{
									backgroundColor: color.value || "currentColor",
									opacity: 0.8,
									borderColor: color.value || "currentColor",
									borderWidth: 1,
								}}
								title={color.name}
								aria-label={`Set text color to ${color.name}`}
							/>
						))}
					</div>

					<DropdownMenuLabel className="px-0 text-muted-foreground flex items-center justify-between">
						Background Color{" "}
						<div
							className="size-3 rounded-sm"
							style={{ backgroundColor: activeColorsState.backgroundColor }}
						/>
					</DropdownMenuLabel>
					<div className="flex flex-wrap gap-2">
						{backgroundColors.map((color) => (
							<button
								key={color.name}
								type="button"
								onClick={() => setBackgroundColor(color.value)}
								className="flex size-6 rounded items-center justify-center border hover:bg-accent"
								style={{
									backgroundColor: color.value,
									opacity: 0.8,
									borderColor: color.value,
									borderWidth: 1,
								}}
								title={color.name}
								aria-label={`Set background color to ${color.name}`}
							/>
						))}
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
