import { Button } from "@optima/ui/components/button";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Button", () => {
	test("should render", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeDefined();
	});
});
