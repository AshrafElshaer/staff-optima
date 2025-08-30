import { Button } from "@optima/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@optima/ui/components/dropdown-menu";
import { useCurrentEditor } from "@tiptap/react";

export function TurnIntoDropdown() {
	const editor = useCurrentEditor();
	if (!editor) return null;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Turn into</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Turn into</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>Paragraph</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Heading 1</DropdownMenuItem>
					<DropdownMenuItem>Heading 2</DropdownMenuItem>
					<DropdownMenuItem>Heading 3</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
