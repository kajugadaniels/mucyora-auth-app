import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("ForgotPasswordForm", () => {
  it("shows the generic recovery confirmation", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByLabelText(/Account email address/i),
      "fake@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /Send recovery instructions/i }),
    );

    expect(
      await screen.findByText(/Check your email if an account exists/i),
    ).toBeInTheDocument();
  });
});
