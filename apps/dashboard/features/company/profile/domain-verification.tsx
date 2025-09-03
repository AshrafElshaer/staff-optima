"use client";
import { MailSend02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@optima/ui/components/badge";
import { Button } from "@optima/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@optima/ui/components/card";
import {
	DataList,
	DataListItem,
	DataListLabel,
	DataListValue,
} from "@optima/ui/components/data-list";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@optima/ui/components/popover";
import { Separator } from "@optima/ui/components/separator";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query/query-client";

export function invalidateDomainVerification(companyId: string) {
	queryClient.invalidateQueries({
		queryKey: [queryKeysFactory.domainVerification.byOrganizationId(companyId)],
	});
}

export function DomainVerification({ companyId }: { companyId: string }) {
	const router = useRouter();
	const services = useServices();
	const domainService = services.getDomainService();
	const { data: domainVerification, isLoading } = useQuery({
		queryKey: [queryKeysFactory.domainVerification.byOrganizationId(companyId)],
		queryFn: () => domainService.getByOrganizationId(companyId),
	});
	const { execute: verifyDomain, isExecuting } = useAction(verifyDomainAction, {
		onSuccess: () => {
			toast.success("Domain verified successfully");
			router.refresh();
			invalidateDomainVerification(companyId);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
			invalidateDomainVerification(companyId);
		},
	});

	const status = domainVerification?.verification_status;

	async function handleVerifyDomain() {
		if (!domainVerification) return;
		verifyDomain({
			domainVerification: domainVerification,
		});
	}

	if (isLoading)
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-start gap-2">
						<Flex
							direction={{
								initial: "column",
								sm: "row",
							}}
							align={{
								sm: "center",
							}}
							gap="2"
							justify="between"
						>
							<Text as="span" className="min-w-fit">
								Domain Verification
							</Text>

							<Skeleton className="w-18 h-7" />
						</Flex>
						<Button
							size="sm"
							variant="outline"
							className="ml-auto"
							type="button"
							disabled
						>
							Verify
						</Button>
						<Button size="sm" variant="outline" disabled>
							<HugeIcon icon={MailSend02Icon} className="w-4 h-4" />
						</Button>
					</CardTitle>
					<CardDescription>
						Verify your domain to ensure that your organization is properly
						identified.
					</CardDescription>
				</CardHeader>
				<Separator />
				<CardContent className="space-y-4">
					<Box overflow="auto" mx="-6" px="6">
						<DataList
							className="rounded-md border p-4"
							orientation={{
								initial: "vertical",
								sm: "horizontal",
							}}
						>
							<DataListItem>
								<DataListLabel minWidth="120px">Name</DataListLabel>
								<DataListValue>staffoptima_verification</DataListValue>
							</DataListItem>
							<DataListItem>
								<DataListLabel minWidth="120px">Type</DataListLabel>
								<DataListValue>TXT</DataListValue>
							</DataListItem>
							<DataListItem>
								<DataListLabel minWidth="120px">Value</DataListLabel>
								<DataListValue>
									<Skeleton className="w-96 h-5" />
								</DataListValue>
							</DataListItem>
							<DataListItem>
								<DataListLabel minWidth="120px">TTL</DataListLabel>
								<DataListValue>60</DataListValue>
							</DataListItem>
							<DataListItem>
								<DataListLabel minWidth="120px">Priority</DataListLabel>
								<DataListValue>auto</DataListValue>
							</DataListItem>
						</DataList>
					</Box>
				</CardContent>
			</Card>
		);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-start gap-2">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<span className="min-w-fit">Domain Verification</span>
						<Badge
							variant={
								status === "pending"
									? "warning"
									: status === "verified"
										? "success"
										: "destructive"
							}
							className="rounded-sm capitalize"
						>
							{status}
						</Badge>
					</div>
					<Button
						size="sm"
						variant="secondary"
						className="ml-auto"
						type="button"
						onClick={handleVerifyDomain}
						disabled={isExecuting}
					>
						{isExecuting ? "Verifying..." : "Verify"}
					</Button>
					{domainVerification && (
						<ForwardDnsEmail domainVerification={domainVerification} />
					)}
				</CardTitle>
				<CardDescription>
					<p>
						Verify your domain to ensure that your company is properly
						identified.
					</p>
				</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent className="space-y-4">
				{domainVerification?.verification_date ? (
					<Text as="p" mb="4" className="text-secondary-foreground">
						Verified at{" "}
						{moment(domainVerification.verification_date).format("MMM D, YYYY")}
					</Text>
				) : null}
				<Box overflow="auto" mx="-6" px="6">
					<DataList
						className="rounded-md border p-4"
						orientation={{
							initial: "vertical",
							sm: "horizontal",
						}}
					>
						<DataListItem>
							<DataListLabel minWidth="120px">Name</DataListLabel>
							<DataListValue>
								staffoptima_verification{" "}
								<CopyToClipboard text="staffoptima_verification" />
							</DataListValue>
						</DataListItem>
						<DataListItem>
							<DataListLabel minWidth="120px">Type</DataListLabel>
							<DataListValue>TXT</DataListValue>
						</DataListItem>
						<DataListItem>
							<DataListLabel minWidth="120px">Value</DataListLabel>
							<DataListValue>
								{domainVerification?.verification_token}
								<CopyToClipboard
									text={domainVerification?.verification_token ?? ""}
								/>
							</DataListValue>
						</DataListItem>
						<DataListItem>
							<DataListLabel minWidth="120px">TTL</DataListLabel>
							<DataListValue>60</DataListValue>
						</DataListItem>
						<DataListItem>
							<DataListLabel minWidth="120px">Priority</DataListLabel>
							<DataListValue>auto</DataListValue>
						</DataListItem>
					</DataList>
				</Box>
			</CardContent>
		</Card>
	);
}

import { zodResolver } from "@hookform/resolvers/zod";
import type { DomainVerificationRow } from "@optima/supabase/types";
import { Form } from "@optima/ui/components/form";
import { FormInput } from "@optima/ui/components/form-controls";
import { Icons } from "@optima/ui/components/icons";
import { Skeleton } from "@optima/ui/components/skeleton";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { HugeIcon } from "@/components/huge-icon";
import { useServices } from "@/hooks/use-services";
import { queryKeysFactory } from "@/lib/react-query/query-keys-factory";
import {
	sendDomainVerificationEmailAction,
	verifyDomainAction,
} from "./profile.actions";

const formSchema = z.object({
	email: z.string().email(),
});

export function ForwardDnsEmail({
	domainVerification,
}: {
	domainVerification: DomainVerificationRow;
}) {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});
	const {
		execute: sendDomainVerificationEmail,
		isExecuting,
		status,
		reset,
	} = useAction(sendDomainVerificationEmailAction, {
		onSuccess: () => {
			form.reset();
			setTimeout(() => {
				setOpen(false);
				reset();
			}, 1000);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		sendDomainVerificationEmail({
			domainVerification: domainVerification,
			sendTo: data.email,
		});
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="secondary" size="sm" className="p-0">
					<HugeIcon icon={MailSend02Icon} className="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="space-y-2 p-2" align="end">
				<p className="text-sm text-secondary-foreground">
					Forward Instructions to
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex items-end gap-2"
					>
						<FormInput
							name="email"
							placeholder="example@example.com"
							inputMode="email"
						/>

						<Button
							variant="secondary"
							size="icon"
							type="submit"
							disabled={isExecuting}
						>
							<AnimatePresence mode="wait">
								{status === "executing" ? (
									<motion.div
										key="loading"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.1 }}
									>
										<Icons.Loader className="w-4 h-4 animate-spin" />
									</motion.div>
								) : status === "hasSucceeded" ? (
									<motion.div
										key="success"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.1 }}
									>
										<Check className="w-4 h-4 text-success" />
									</motion.div>
								) : (
									<motion.div
										key="default"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.1 }}
									>
										<HugeIcon icon={SentIcon} className="w-4 h-4" />
									</motion.div>
								)}
							</AnimatePresence>
						</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	);
}
