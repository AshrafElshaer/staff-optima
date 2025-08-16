import { stripeClient } from "@better-auth/stripe/client";
import {
	customSessionClient,
	emailOTPClient,
	inferAdditionalFields,
	inferOrgAdditionalFields,
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
			schema: inferOrgAdditionalFields<typeof auth>(),
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

export type Session = typeof authClient.$Infer.Session;
