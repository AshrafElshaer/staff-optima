import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth.server";
export default async function CalendarPage() {
	const user = await auth.api.getSession({
		headers: await headers(),
	});

	return <div>Calendar</div>;
}
