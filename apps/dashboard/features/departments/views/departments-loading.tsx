import { JobLinkIcon } from "@hugeicons/core-free-icons";
import { Card } from "@optima/ui/components/card";
import { Skeleton } from "@optima/ui/components/skeleton";
import { Flex, Grid } from "@radix-ui/themes";
import { UserIcon } from "lucide-react";
import { HugeIcon } from "@/components/huge-icon";

export function DepartmentsLoading() {
	return (
		<Grid
			columns={{
				initial: "1",
				md: "2",
				lg: "3",
			}}
			gap="4"
		>
			{Array.from({ length: 3 }, (_, index) => {
				const id = `skeleton-${index}`;
				return (
					<Card
						key={id}
						className=" group h-fit"
						// onClick={handleNavigate}
					>
						<div className="flex items-center  gap-4 px-4">
							<Skeleton className="w-1/2 h-4" />
						</div>
						<Flex align="center" gap="2" px="4">
							<HugeIcon icon={JobLinkIcon} size={18} strokeWidth={2} />{" "}
							<Skeleton className="size -4 " />
							<UserIcon size={18} strokeWidth={2} className="ml-auto" />{" "}
							<Skeleton className="size -4 " />
						</Flex>
					</Card>
				);
			})}
		</Grid>
	);
}
