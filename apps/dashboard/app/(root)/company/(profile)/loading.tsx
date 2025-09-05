import { MailSend02Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@optima/ui/components/avatar";
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
import { Label } from "@optima/ui/components/label";
import { Separator } from "@optima/ui/components/separator";
import { Skeleton } from "@optima/ui/components/skeleton";
import { Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { HugeIcon } from "@/components/huge-icon";

export default function ProfileLoading() {
	return (
		<Container size="3">
			<div className="space-y-8 w-full mx-auto px-4 py-8">
				<Flex
					direction={{
						initial: "column-reverse",
						sm: "row",
					}}
					justify="between"
					align={"start"}
					className="w-full gap-4"
				>
					<Box className="space-y-2">
						<Label className="font-semibold text-base">Company Logo</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Accepts : PNG, JPG, or SVG.
							<br />
							Max size : 1MB
							<br />
							Recommended dimensions: 200x200 pixels.
						</Text>
					</Box>
					<div className="relative group">
						<Skeleton className="rounded-md size-28" />
						<div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center">
							<Plus className="size-10 text-secondary-foreground" />
						</div>
					</div>
				</Flex>
				<Separator />
				<Flex
					direction={{
						initial: "column",
						sm: "row",
					}}
					justify="between"
					align="start"
					className="w-full gap-4"
				>
					<Box className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="name">
							Legal Name
						</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Company's registered legal name
						</Text>
					</Box>
					<Box className="w-full md:w-1/2">
						<Skeleton className="h-9 w-full" />
					</Box>
				</Flex>
				<Separator />
				<Flex
					direction={{
						initial: "column",
						sm: "row",
					}}
					justify="between"
					align="start"
					className="w-full gap-4"
				>
					<Box className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="industry">
							Industry
						</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Company's industry
						</Text>
					</Box>
					<Box className="w-full md:w-1/2">
						<Skeleton className="h-9 w-full" />
					</Box>
				</Flex>
				<Separator />
				<Flex
					direction={{
						initial: "column",
						sm: "row",
					}}
					justify="between"
					align="start"
					className="w-full gap-4"
				>
					<Box className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="employeeCount">
							Company Size
						</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Company's employee count
						</Text>
					</Box>
					<Box className="w-full md:w-1/2">
						<Skeleton className="h-9 w-full" />
					</Box>
				</Flex>
				<Separator />
				<Flex
					direction={{
						initial: "column",
						sm: "row",
					}}
					justify="between"
					align="start"
					className="w-full gap-4"
				>
					<Box className="space-y-2 w-full md:w-1/2">
						<Label className="font-semibold text-base" htmlFor="domain">
							Domain
						</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Company's official website domain.
						</Text>
					</Box>
					<Box className="w-full md:w-1/2">
						<Skeleton className="h-9 w-full" />
					</Box>
				</Flex>

				<Separator />
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
				<Separator />
				<Flex direction="column" gap="4" width="full">
					<Box className="space-y-2" width="full">
						<Label className="font-semibold text-base" htmlFor="address1">
							Location
						</Label>
						<Text as="p" size="2" className="text-muted-foreground">
							Company's headquarter address
						</Text>
					</Box>
					<Box className="space-y-2">
						<Label className="text-sm font-medium" htmlFor="address1">
							Address 1
						</Label>
						<Skeleton className="h-9 w-full" />
					</Box>
					<Grid
						mt="4"
						columns={{
							initial: "1",
							sm: "2",
						}}
						gap="8"
						width="auto"
					>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="address2">
								Address 2
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="city">
								City
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="state">
								State
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="zipCode">
								Zip Code
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="country">
								Country
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
						<Box className="space-y-2">
							<Label className="text-sm font-medium" htmlFor="timezone">
								Timezone
							</Label>
							<Skeleton className="h-9 w-full" />
						</Box>
					</Grid>
				</Flex>
				<Separator />
				<Flex direction="column" gap="4" width="full">
					<Flex direction="row" justify="between" align="center" gap="4">
						<Box className="space-y-2" width="full">
							<Label className="font-semibold text-base">Profile</Label>
							<Text as="p" size="2" className="text-muted-foreground md:w-3/4">
								Write a detailed profile showcasing your company's mission,
								values, services, and achievements.
							</Text>
						</Box>
						<Box
							width={{
								initial: "full",
								sm: "auto",
							}}
						>
							<Button variant="secondary" disabled>
								Preview
							</Button>
						</Box>
					</Flex>
					<Skeleton className="w-full h-96 rounded-md" />
				</Flex>
			</div>
		</Container>
	);
}
