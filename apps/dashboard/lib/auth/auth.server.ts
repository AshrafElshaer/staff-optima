import { stripe } from "@better-auth/stripe";
import { ChangeEmailConfirmationEmail, OtpEmail } from "@optima/email";
import { createServerClient } from "@optima/supabase/clients/server";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {
	type BetterAuthPlugin,
	createAuthMiddleware,
	customSession,
	emailOTP,
	multiSession,
	organization,
	phoneNumber,
} from "better-auth/plugins";
import { headers } from "next/headers";
import { Pool } from "pg";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { resend } from "@/lib/resend";
import { env } from "../env";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-07-30.basil",
});

export const auth = betterAuth({
	appName: "Staff Optima",
	baseURL: env.BETTER_AUTH_URL,
	database: new Pool({
		connectionString: env.DATABASE_URL,
	}),

	trustedOrigins: [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"https://app.staffoptima.co",
		"https://staffoptima.co",
	],
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
		useSecureCookies: env.NODE_ENV === "production",
		defaultCookieAttributes: {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "lax",
		},
	},
	hooks: {
		after: createAuthMiddleware(async (context) => {
			const userId = context.context.session?.user.id;
			if (!userId) return;
			const supabase = await createServerClient();
			const { data, error } = await supabase
				.from("member")
				.select(`
					*,
					organization (id),
					role (id, name, permissions)
				`)
				.eq("userId", userId)
				.single();
			if (error) {
				console.error("Error fetching user data:", error);
				return;
			}
			await supabase.rpc("set_current_user", {
				user_data: JSON.stringify({
					id: data.userId,
					role: data.role?.name,
					permissions: data.role?.permissions,
					organization: data.organization?.id,
				}),
			});
		}),
	},
	session: {
		expiresIn: 604800, // 7 days
		updateAge: 86400, // 1 day
		storeSessionInDatabase: true,
		freshAge: 0,
		cookieCache: {
			enabled: false, // Disable cookie cache to avoid issues
		},
	},
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					try {
						const ipAddress = (await headers()).get("x-forwarded-for");
						const supabase = await createServerClient();
						const { data, error } = await supabase
							.from("member")
							.select(`
								*,
								organization (id),  
								user (*),
								role (id, name, permissions)
							`)
							.eq("userId", session.userId)
							.single();

						if (error && error.code !== "PGRST116") {
							console.error("Error fetching member data:", error);
						}

						return {
							data: {
								...session,
								ipAddress: ipAddress || null,
								activeOrganizationId: data?.organization?.id || null,
								role: data?.role || null,
								permissions: data?.role?.permissions || null,
							},
						};
					} catch (error) {
						console.error("Error in session creation hook:", error);
						return {
							data: {
								...session,
								ipAddress: null,
								activeOrganizationId: null,
								role: null,
								permissions: null,
							},
						};
					}
				},
			},
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			try {
				const supabase = await createServerClient();
				const { data, error } = await supabase
					.from("member")
					.select(`
						*,
						organization (id),
						user (*),
						role (id, name, permissions)
					`)
					.eq("userId", user.id)
					.single();

				if (error && error.code !== "PGRST116") {
					console.error("Error fetching member data in customSession:", error);
				}

				return {
					user: {
						...user,
						phoneNumber: data?.user?.phoneNumber || null,
						jobTitle: data?.user?.jobTitle || null,
					},
					session: {
						...session,
						activeOrganizationId: data?.organization?.id || null,
						role: data?.role?.name || null,
						permissions: data?.role?.permissions || null,
					},
				};
			} catch (error) {
				console.error("Error in customSession plugin:", error);
				return {
					user: {
						...user,
						phoneNumber: null,
						jobTitle: null,
					},
					session: {
						...session,
						activeOrganizationId: null,
						role: null,
						permissions: null,
					},
				};
			}
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
			createCustomerOnSignUp: true,
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
				authorizeReference: async ({ user, session, referenceId, action }) => {
					const supabase = await createServerClient();
					// Check if the user has permission to manage subscriptions for this reference
					if (
						action === "upgrade-subscription" ||
						action === "cancel-subscription" ||
						action === "restore-subscription"
					) {
						const { data, error } = await supabase
							.from("member")
							.select("role (name)")
							.eq("organizationId", referenceId)
							.eq("userId", user.id)
							.single();
						if (error) {
							console.error("Error fetching member data:", error);
							return false;
						}
						return data?.role?.name === "owner";
					}
					return true;
				},
				getCheckoutSessionParams: async () => {
					return {
						params: {
							automatic_tax: {
								enabled: true,
							},
						},
					};
				},

				plans: [
					{
						name: "basic", // the name of the plan, it'll be automatically lower cased when stored in the database
						priceId: "price_1RxAZa6BqsBbNKLOGPGYLPzi", // the price ID from stripe
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
				const res = await resend.emails.send(
					{
						from: "Staff Optima <security@www.staffoptima.co>",
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
				console.log(res);
			},
			sendVerificationOnSignUp: false,
			otpLength: 6,
			expiresIn: 600, // 10 minutes
		}),
		nextCookies(),
	],
});
