"use client";

import { Toaster } from "@optima/ui/components/sonner";
import { Theme } from "@radix-ui/themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";
import type * as React from "react";
import { queryClient } from "@/lib/react-query/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<NextThemesProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					enableColorScheme
				>
					<Theme style={{ backgroundColor: "var(--background)" }}>
						{children}
					</Theme>
					<Toaster duration={5000} closeButton position="top-right" />
					<ReactQueryDevtools initialIsOpen={false} />
				</NextThemesProvider>
			</QueryClientProvider>
		</NuqsAdapter>
	);
}
