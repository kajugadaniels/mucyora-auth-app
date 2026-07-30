import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { ResetPasswordForm } from "./ResetPasswordForm";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("ResetPasswordForm", () => {
  it("completes the valid static reset flow", async () => {
    const user = userEvent.setup();
    render(
      <ResetPasswordForm
        resetReference={authMockScenarios.validResetReference}
      />,
    );

    const password = "This is a long demo passphrase";
    await user.type(screen.getByLabelText(/^New password/i), password);
    await user.type(screen.getByLabelText(/Confirm new password/i), password);
    await user.click(screen.getByRole("button", { name: /Set new password/i }));

    expect(
      await screen.findByText(/Static password reset completed/i),
    ).toBeInTheDocument();
  });
});
