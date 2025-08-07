// import { createServerClient } from "@/lib/supabase/server";
import { getCountryCode } from "@optima/location/index";
// import { getCurrentUser } from "@optima/supabase/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserOnboarding } from "@/features/onboarding/user-onboarding";

export const metadata: Metadata = {
	title: "Onboarding User",
	description: "Setup your profile",
};

export default async function OnboardingUserPage() {
	const countryCode = await getCountryCode();
	return <UserOnboarding countryCode={countryCode} />;
}
