import { getCountryCode } from "@optima/location";
import type { Metadata } from "next";
import { UserOnboarding } from "@/features/onboarding/user-onboarding";

export const metadata: Metadata = {
	title: "Onboarding User",
	description: "Setup your profile",
};

export default async function OnboardingUserPage() {
	const countryCode = await getCountryCode();
	return <UserOnboarding countryCode={countryCode} />;
}
