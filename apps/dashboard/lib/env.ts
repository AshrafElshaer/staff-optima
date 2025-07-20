import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		JWT_SIGN_SECRET: z.string().min(1),
		NODE_ENV: z.enum(["development", "production"]),
	},
	client: {
		NEXT_PUBLIC_SUPABASE_URL: z.url(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
		NEXT_PUBLIC_SUPABASE_SERVICE_KEY: z.string().min(1),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		// SUPABASE
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_SIGN_SECRET: process.env.JWT_SIGN_SECRET,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_SERVICE_KEY:
			process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY,
	},
});
