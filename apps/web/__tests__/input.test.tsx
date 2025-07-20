
import { Input } from "@optima/ui/components/inputs";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Input", () => {
	test("should render", () => {
		render(<Input />);
		expect(screen.getByRole("textbox")).toBeDefined();
	});
});
