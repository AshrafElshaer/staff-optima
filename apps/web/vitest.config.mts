import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		tsconfigPaths({
			ignoreConfigErrors: true,
		}),
		react(),
	],
	test: {
		environment: "jsdom",
		globals: true,
		exclude: [
			"node_modules",
			".bun",
			"dist",
			"build",
			"coverage",
			"**/tsconfig.json", // optional: avoid parsing package tsconfigs
		],
		setupFiles: ["./__tests__/test-setup.ts"],
	},
});
