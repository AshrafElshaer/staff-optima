
import {
	ChangeEmailConfirmationEmail,
	OtpEmail,
} from "@optima/email";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {
	type BetterAuthPlugin,
	customSession,
	emailOTP,
	multiSession,
	organization,
	phoneNumber,
} from "better-auth/plugins";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { resend } from "@/lib/resend";

import { stripe } from "@better-auth/stripe";
import { createServerClient } from "@optima/supabase/clients/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { env } from "../env";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-06-30.basil",
});

export const auth = betterAuth({
	appName: "Staff Optima",
	secret: env.JWT_SIGN_SECRET,
	database: new Pool({
		connectionString: env.DATABASE_URL,
	}),

	trustedOrigins: ["http://*.localhost:3000", "https://*.staffoptima.co"],
	user: {
		deleteUser: {
			enabled: true,
			async afterDelete(user, request) {
				//TODO: SEND EMAIL TO USERS
				console.log(user, request);
			},
		},
		changeEmail: {
			enabled: true,
			async sendChangeEmailVerification(data) {
				await resend.emails.send(
					{
						from: "Unified Space <security@unifiedspace.co>",
						to: [data.newEmail],
						subject: "Verify your email address",
						react: ChangeEmailConfirmationEmail({
							user: data.user.name,
							newEmail: data.newEmail,
							url: data.url,
							token: data.token,
						}),
						headers: {
							"X-Entity-Ref-ID": data.newEmail,
						},
					},
					{
						idempotencyKey: data.token,
					},
				);
			},
		},
		additionalFields: {
			jobTitle: {
				type: "string",
				required: false,
			},
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "linkedin", "slack"],
		},
	},
	advanced: {
		database: {
			generateId() {
				return uuidv4();
			},
		},
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
		},
		useSecureCookies: true,
		defaultCookieAttributes: {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		},
	},
	session: {
		expiresIn: 604800, // 7 days
		updateAge: 86400, // 1 day
		storeSessionInDatabase: true,
		freshAge: 0,
		cookieCache: {
			enabled: true, // Enable caching session in cookie (default: `false`)
			maxAge: 300, // 5 minutes
		},
	},
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const ipAddress = (await headers()).get("x-forwarded-for");
					const supabase = await createServerClient();
					const { data } = await supabase
						.from("member")
						.select(`
							*,
							organization (id),  
							user (*)
						`)
						.eq("userId", session.userId)
						.single();
					return {
						data: {
							...session,
							ipAddress: ipAddress || null,
							activeOrganizationId: data?.organizationId || null,
						},
					};
				},
			},
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		// microsoft: {
		// 	clientId: process.env.MICROSOFT_CLIENT_ID as string,
		// 	clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
		// 	// Optional
		// 	tenantId: "common",
		// 	prompt: "select_account", // Forces account selection
		// },
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID as string,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET as string,

		// },
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const supabase = await createServerClient();
			const { data } = await supabase
				.from("member")
				.select(`
							*,
							organization (id),
							user (*)
						`)
				.eq("userId", user.id)
				.single();

			return {
				user: {
					...data?.user,
				},
				session: {
					...session,
					activeOrganizationId: data?.organizationId || null,
				},
			};
		}),
		phoneNumber({
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Will implement later
			sendOTP: ({ phoneNumber, code }, request) => {
				// Implement sending OTP code via SMS
			},
		}),
		organization({
			teams: {
				enabled: true,
				allowRemovingAllTeams: false, // Prevent removing the last team
			},
			schema: {
				organization: {
					additionalFields: {
						domain: {
							type: "string",
							required: true,
							input: true,
						},
						isDomainVerified: {
							type: "boolean",
							required: false,
							defaultValue: false,
						},
						industry: {
							type: "string",
							required: true,
						},
						profile: {
							type: "string",
							required: false,
						},
						address1: {
							type: "string",
							required: false,
						},
						address2: {
							type: "string",
							required: false,
						},
						city: {
							type: "string",
							required: false,
						},
						state: {
							type: "string",
							required: false,
						},
						zipCode: {
							type: "string",
							required: false,
						},
						country: {
							type: "string",
							required: true,
						},
						timezone: {
							type: "string",
							required: true,
						},
						employeeCount: {
							type: "string",
							required: false,
						},
					},
				},
				member: {
					additionalFields: {
						roleId: {
							type: "string",
							required: false,
							input: true,
							references: {
								model: "role",
								field: "id",
								onDelete: "set null",
							},
						},
					},
				},
			},

			cancelPendingInvitationsOnReInvite: true,
			creatorRole: "owner",
			memberRole: "member",

			invitationExpiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
			organizationDeletion: {
				disabled: false,
				async afterDelete(data, request) {
					//TODO: SEND EMAIL TO ALL USERS IN THE ORGANIZATION
					console.log(data, request);
				},
			},
		}) as BetterAuthPlugin,
		multiSession(),
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
			subscription: {
				enabled: true,
				organization: {
					enabled: true,
				},
				async onSubscriptionCancel(data) {
					//TODO: SEND EMAIL TO OWNER OF THE ORGANIZATION
					console.log(data);
				},
				async onSubscriptionUpdate(data) {
					//TODO: SEND EMAIL TO OWNER OF THE ORGANIZATION
					console.log(data);
				},
				async onSubscriptionComplete(data, request) {
					//TODO: SEND EMAIL TO OWNER OF THE ORGANIZATION
					console.log(data, request);
				},

				plans: [
					{
						name: "basic", // the name of the plan, it'll be automatically lower cased when stored in the database
						priceId: "price_1234567890", // the price ID from stripe
						annualDiscountPriceId: "price_1234567890", // (optional) the price ID for annual billing with a discount
						limits: {
							members: 3,
						},
					},
					{
						name: "pro",
						priceId: "price_0987654321",
						annualDiscountPriceId: "price_0987654321",
						freeTrial: {
							days: 14,
						},
					},
				],
			},
		}),

		emailOTP({
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Will implement later
			async sendVerificationOTP({ email, otp, type }) {
				await resend.emails.send(
					{
						from: "Staff Optima <security@staffoptima.co>",
						to: [email],
						subject: "OTP Code for Staff Optima",
						react: OtpEmail({
							otpCode: otp,
						}),
						headers: {
							"X-Entity-Ref-ID": email,
						},
					},
					{
						idempotencyKey: otp,
					},
				);
			},
			sendVerificationOnSignUp: false,
			otpLength: 6,
			expiresIn: 600, // 10 minutes
		}),
		nextCookies(),
	], // make sure this is the last plugin in the array
});
