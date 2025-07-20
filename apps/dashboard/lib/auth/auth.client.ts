import { stripeClient } from "@better-auth/stripe/client";
import {
	customSessionClient,
	emailOTPClient,
	inferAdditionalFields,
	multiSessionClient,
	organizationClient,
	phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.server";

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof auth>(),
		customSessionClient<typeof auth>(),
		emailOTPClient(),
		phoneNumberClient(),
		multiSessionClient(),
		organizationClient({
			teams: {
				enabled: true,
				allowRemovingAllTeams: false,
			},
		}),
		stripeClient({
			subscription: true,
		}),
	],
});
