import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@optima/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@optima/ui/components/form";
import { FormAddOnInput } from "@optima/ui/components/form-controls/index";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@optima/ui/components/popover";
import type { Editor } from "@tiptap/react";
import { Check, Link, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	url: z
		.string()
		.min(1, { message: "Domain is required" })
		.refine(
			(val) => {
				// This regex validates domains without protocols
				const domainRegex =
					/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
				return domainRegex.test(val);
			},
			{ message: "Please enter a valid domain (e.g., example.com)" },
		),
});

type FormValues = z.infer<typeof formSchema>;

interface LinkPopoverProps {
	editor: Editor;
	onOpenChange?: (open: boolean) => void;
}

export function LinkPopover({ editor, onOpenChange }: LinkPopoverProps) {
	const isExistingLink = editor.isActive("link");
	const existingLink = editor.getAttributes("link").href;
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: isExistingLink ? existingLink : "",
		},
	});

	useEffect(() => {
		if (isExistingLink) {
			form.setValue("url", existingLink);
		}
	}, [isExistingLink, existingLink, form]);

	function handleUnsetLink() {
		editor.chain().focus().unsetLink().run();
		form.reset();
		onOpenChange?.(false);
	}

	function onSubmit(values: FormValues) {
		editor
			.chain()
			.focus()
			.setLink({ href: `https://${values.url}`, target: "_blank" })
			.run();
		form.reset();
		onOpenChange?.(false);
	}

	return (
		<Popover onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm">
					<Link className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-2" align="end" sideOffset={8}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-2 items-start"
					>
						<FormAddOnInput
							name="url"
							addOn="https://"
							addOnDirection="start"
						/>
						<Button type="submit" size="icon">
							<Check className="size-4" />
						</Button>
						{isExistingLink && (
							<Button
								type="button"
								variant="destructive"
								size="icon"
								onClick={handleUnsetLink}
							>
								<X className="size-4" />
							</Button>
						)}
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	);
}
