"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons";
import { createTeamSchema } from "@optima/supabase/validations/team.validations";
import { Button } from "@optima/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@optima/ui/components/dialog";
import { Form } from "@optima/ui/components/form";
import {
	FormFieldWrapper,
	FormInput,
	FormTextarea,
} from "@optima/ui/components/form-controls";
import { Icons } from "@optima/ui/components/icons";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { HugeIcon } from "@/components/huge-icon";
import { MemberSelector } from "@/components/member-selector";
import { Can } from "@/lib/auth/abilities.context";
import { createDepartment } from "../department.actions";

export function NewDepartment() {
	const [open, setOpen] = useState(false);
	const { execute, isExecuting } = useAction(createDepartment, {
		onSuccess: () => {
			toast.success("Department created successfully");
			setOpen(false);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});
	const formContext = useForm({
		// biome-ignore lint/suspicious/noExplicitAny: zodResolver is not typed
		resolver: zodResolver(createTeamSchema as any),
		defaultValues: {
			name: "",
			description: "",
			managerId: "",
		},
	});

	function onSubmit(data: z.infer<typeof createTeamSchema>) {
		console.log(data);
		execute(data);
	}
	return (
		<Can I="create" a="team">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="secondary" size="sm">
						<HugeIcon icon={DashboardSquareAddIcon} className="size-4" />
						New Department
					</Button>
				</DialogTrigger>
				<DialogContent className="">
					<DialogHeader className="pb-0">
						<DialogTitle className="flex items-center gap-2">
							<HugeIcon icon={DashboardSquareAddIcon} className="size-4" />
							New Department
						</DialogTitle>
						<DialogDescription className="flex items-center ">
							Create a new department to organize your jobs.
						</DialogDescription>
					</DialogHeader>

					<Form {...formContext}>
						<form
							onSubmit={formContext.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormInput
								name="name"
								label="Name"
								placeholder="e.g. IT, Accounting"
							/>
							<FormTextarea
								name="description"
								label="Description"
								placeholder="e.g. Handles all IT infrastructure and support for the company"
								isOptional
							/>
							<FormFieldWrapper name="managerId" label="Manager">
								<MemberSelector
									value={formContext.watch("managerId")}
									onChange={(value) => formContext.setValue("managerId", value)}
								/>
							</FormFieldWrapper>
							<DialogFooter>
								<DialogClose asChild>
									<Button size="sm" variant="outline" disabled={isExecuting}>
										Cancel
									</Button>
								</DialogClose>
								<Button size="sm" type="submit" disabled={isExecuting}>
									{isExecuting ? (
										<Icons.Loader className="size-4 animate-spin" />
									) : null}
									Create
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</Can>
	);
}
