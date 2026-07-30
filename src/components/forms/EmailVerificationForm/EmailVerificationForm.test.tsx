import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { EmailVerificationForm } from "./EmailVerificationForm";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

describe("EmailVerificationForm", () => {
  it("accepts the documented demonstration code", async () => {
    const user = userEvent.setup();
    render(<EmailVerificationForm />);

    const digits = screen.getAllByRole("textbox");
    for (const [index, digit] of authMockScenarios.verificationCode
      .split("")
      .entries()) {
      await user.type(digits[index], digit);
    }

    await user.click(screen.getByRole("button", { name: /Verify email/i }));
    expect(
      await screen.findByText(/Email verified in the static demonstration/i),
    ).toBeInTheDocument();
  });
});
