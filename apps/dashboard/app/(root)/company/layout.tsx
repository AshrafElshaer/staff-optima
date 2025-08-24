// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useAbility } from "@/hooks/use-ability";

export default function CompanyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const router = useRouter();
	// const ability = useAbility();
	// const isAllowed =
	// 	ability.can("manage", "organization") ||
	// 	ability.can("manage", "billing") ||
	// 	ability.can("invite", "user") ||
	// 	ability.can("update", "user") ||
	// 	ability.can("create", "team") ||
	// 	ability.can("update", "team") ||
	// 	ability.can("delete", "team") ||
	// 	ability.can("assign_members", "team");

	// if (!isAllowed) {
	// 	toast.error("Unauthorized access to this page");
	// 	router.push("/");
	// 	return null;
	// }

	return <>{children}</>;
}
