"use client";

import { useAbility } from "@/hooks/use-ability";

export default function CalendarPage() {
	const ability = useAbility();

	console.log(ability.can("manage", "organization"));

	return <div>Calendar</div>;
}
