import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Mock the nuqs adapter for testing
const MockNuqsAdapter = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

export function TestWrapper({ children }: { children: React.ReactNode }) {
	const queryClient = createTestQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<MockNuqsAdapter>{children}</MockNuqsAdapter>
		</QueryClientProvider>
	);
}
