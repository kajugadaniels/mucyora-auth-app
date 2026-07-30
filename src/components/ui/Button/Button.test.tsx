import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogIn } from "lucide-react";
import { vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("prevents repeated actions while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button
        icon={<LogIn />}
        isLoading
        loadingText="Signing in"
        onClick={onClick}
      >
        Sign in
      </Button>,
    );
    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
