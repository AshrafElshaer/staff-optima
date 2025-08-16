import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SignIn } from "@/features/auth/views/sign-in";
import { TestWrapper } from "./test-wrapper";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn().mockReturnValue({
		push: vi.fn(),
	}),
}));

vi.mock("nuqs", () => ({
	useQueryStates: vi.fn().mockReturnValue([
		{
			email: "",
			activeTab: "sign-in",
			redirectUrl: "/",
		},
		vi.fn(), // setAuthParams function
	]),
	createSerializer: vi.fn(),
	parseAsString: {
		withDefault: vi.fn().mockReturnValue(vi.fn()),
	},
	parseAsStringEnum: vi.fn().mockReturnValue({
		withDefault: vi.fn().mockReturnValue(vi.fn()),
	}),
}));

// Mock the nuqs adapter
vi.mock("nuqs/adapters/next/app", () => ({
	NuqsAdapter: ({ children }: { children: React.ReactNode }) => children,
}));

describe("SignIn Page", () => {
	test("should render", () => {
		const SignInPage = render(
			<TestWrapper>
				<SignIn />
			</TestWrapper>,
		);

		expect(
			SignInPage.getByText("Sign in to your account to continue"),
		).toBeDefined();
	});

	test("should show error when email is invalid", async () => {
		const SignInPage = render(
			<TestWrapper>
				<SignIn />
			</TestWrapper>,
		);

		const emailInput = SignInPage.getByRole("textbox", {
			name: /email address/i,
		});
		const submitButton = SignInPage.getByRole("button", {
			name: /continue with email/i,
		});
		fireEvent.change(emailInput, { target: { value: "test" } });
		fireEvent.blur(emailInput);
		fireEvent.click(submitButton);
		await waitFor(() => {
			expect(emailInput.getAttribute("aria-invalid")).toBe("true");
		});
	});

	test("should show error when email is empty", async () => {
		const SignInPage = render(
			<TestWrapper>
				<SignIn />
			</TestWrapper>,
		);
		const emailInput = SignInPage.getByRole("textbox", {
			name: /email address/i,
		});
		const submitButton = SignInPage.getByRole("button", {
			name: /continue with email/i,
		});
		fireEvent.click(submitButton);
		await waitFor(() => {
			expect(emailInput.getAttribute("aria-invalid")).toBe("true");
		});
	});
});
