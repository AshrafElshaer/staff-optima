// import { getUser } from "@optima/supabase/queries";

import { createMongoAbility } from "@casl/ability";
// import { setupAnalytics } from "@optima/analytics/server";
import { ratelimit } from "@optima/kv/ratelimit";
import { createServerClient } from "@optima/supabase/clients/server";
import { headers } from "next/headers";
// import * as Sentry from "@sentry/nextjs";
import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { type AppAbility, createAbility } from "@/lib/auth/abilities";
import { auth } from "@/lib/auth/auth.server";
import { resend } from "@/lib/resend";
import { ServiceFactory } from "../../../packages/supabase/src/services/service.factory";

const handleServerError = (e: Error) => {
	console.error("Action error:", e.message);

	if (e instanceof Error) {
		return e.message;
	}

	return DEFAULT_SERVER_ERROR_MESSAGE;
};

export const actionClient = createSafeActionClient({
	handleServerError,
});

export const actionClientWithMeta = createSafeActionClient({
	handleServerError,
	defineMetadataSchema() {
		return z.object({
			name: z.string(),
			track: z
				.object({
					event: z.string(),
					channel: z.string(),
				})
				.optional(),
		});
	},
});

export const authActionClient = actionClientWithMeta
	.use(async ({ next, clientInput: _clientInput, metadata: _metadata }) => {
		const result = await next({
			ctx: {
				resend,
			},
		});

		// Update the logging section to handle potential errors
		// try {
		// 	if (process.env.NODE_ENV === "development") {
		// 		logger.info(`Input -> ${JSON.stringify(clientInput)}`);
		// 		logger.info(`Result -> ${JSON.stringify(result.data)}`);
		// 		logger.info(`Metadata -> ${JSON.stringify(metadata.name)}`);
		// 	}
		// } catch (error) {
		// 	console.warn("Logger error:", error);
		// }

		//   return result;
		// }

		return result;
	})
	.use(async ({ next, metadata }) => {
		try {
			const ip = (await headers()).get("x-forwarded-for") || "unknown";

			// Wrap rate limiting in try-catch
			try {
				const { success, remaining } = await ratelimit.limit(
					`${ip}-${metadata.name}`,
				);

				if (!success) {
					throw new Error("Too many requests");
				}

				return next({
					ctx: {
						ratelimit: {
							remaining,
						},
					},
				});
			} catch {
				return next({
					ctx: {
						ratelimit: {
							remaining: 1,
						},
					},
				});
			}
		} catch (error) {
			console.error("Middleware error:", error);
			throw error;
		}
	})
	.use(async ({ next, metadata: _metadata }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const supabase = await createServerClient();
		const services = ServiceFactory.getInstance(supabase);

		const abilities = createAbility(
			JSON.parse(session.session.permissions || "[]"),
		);

		// if (metadata) {
		// 	const analytics = await setupAnalytics({
		// 		userId: user.id,
		// 	});
		// 	if (metadata.track) {
		// 		analytics.track(metadata.track);
		// 	}
		// }
		return next({
			ctx: {
				session,
				services,
				supabase,
				abilities,
			},
		});

		// return Sentry.withServerActionInstrumentation(metadata.name, async () => {

		// });
	});
