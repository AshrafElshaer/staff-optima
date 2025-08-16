import type { Metadata } from "next";

import { OrganizationOnboarding } from "@/features/onboarding/organization-onboarding";

export const metadata: Metadata = {
	title: "Onboarding Organization",
	description: "Setup your organization",
};

export default async function OnboardingOrganizationPage() {
	return <OrganizationOnboarding />;
}
