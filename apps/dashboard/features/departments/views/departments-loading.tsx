import { JobLinkIcon } from "@hugeicons/core-free-icons";
import { Card } from "@optima/ui/components/card";
import { Skeleton } from "@optima/ui/components/skeleton";
import { UserIcon } from "lucide-react";
import { HugeIcon } from "@/components/huge-icon";

export function DepartmentsLoading() {
	return (
		<section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }, (_, index) => {
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
						<div className="flex items-center gap-2 px-4">
							<HugeIcon icon={JobLinkIcon} size={18} strokeWidth={2} />{" "}
							<Skeleton className="size -4 " />
							<UserIcon size={18} strokeWidth={2} className="ml-auto" />{" "}
							<Skeleton className="size -4 " />
						</div>
					</Card>
				);
			})}
		</section>
	);
}
