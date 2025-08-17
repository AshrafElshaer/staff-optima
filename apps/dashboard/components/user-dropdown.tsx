"use client";
import {
	AccountSetting03Icon,
	AiComputerIcon,
	Door01Icon,
	Moon02Icon,
	Sun01Icon,
} from "@hugeicons/core-free-icons";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@optima/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@optima/ui/components/dropdown-menu";
import { Icons } from "@optima/ui/components/icons";
import { Skeleton } from "@optima/ui/components/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTransition } from "react";
import { authSearchParamsSerializer } from "@/features/auth/auth.searchParams";
import { authClient } from "@/lib/auth/auth.client";
import { HugeIcon } from "./huge-icon";

export function UserDropdown() {
	const { data: session, isPending } = authClient.useSession();
	const [isLogoutPending, startLogout] = useTransition();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const [firstName, lastName] = session?.user?.name?.split(" ") ?? [];

	if (isPending) return <Skeleton className="size-8 rounded-full" />;

	function handleLogout(e: React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();
		startLogout(async () => {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push(
							`/auth?${authSearchParamsSerializer({
								redirectUrl: pathname,
							})}`,
						);
					},
				},
			});
		});
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="size-8">
					<AvatarImage
						src={session?.user?.image ?? undefined}
						alt={session?.user?.name ?? undefined}
					/>
					<AvatarFallback>
						{firstName?.charAt(0).toUpperCase() ?? ""}
						{lastName?.charAt(0).toUpperCase() ?? ""}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent alignOffset={6} align="end">
				<DropdownMenuLabel>
					<div className="flex flex-col">
						<p className="text-sm font-medium">{session?.user?.name}</p>
						<p className="text-xs text-muted-foreground">
							{session?.user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<HugeIcon
							size={16}
							icon={
								theme === "dark"
									? Moon02Icon
									: theme === "light"
										? Sun01Icon
										: AiComputerIcon
							}
							className="mr-2"
						/>
						Theme
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem onClick={() => setTheme("light")}>
							<HugeIcon icon={Sun01Icon} />
							Light
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("dark")}>
							<HugeIcon icon={Moon02Icon} />
							Dark
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("system")}>
							<HugeIcon icon={AiComputerIcon} />
							System
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem>
					<HugeIcon icon={AccountSetting03Icon} />
					Account
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleLogout} disabled={isLogoutPending}>
					{isLogoutPending ? (
						<Icons.Loader className="animate-spin" />
					) : (
						<HugeIcon icon={Door01Icon} />
					)}
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
