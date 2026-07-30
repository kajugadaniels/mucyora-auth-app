import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockCitizenNationalId } from "@/mocks/data/citizens";
import { CreateAccountFlow } from "./CreateAccountFlow";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

describe("CreateAccountFlow", () => {
  it("completes the static NID registration wizard", async () => {
    const user = userEvent.setup();
    render(<CreateAccountFlow />);

    await user.type(
      screen.getByLabelText(/Rwanda National ID/i),
      mockCitizenNationalId,
    );
    await user.click(
      screen.getByRole("button", { name: /Find citizen record/i }),
    );
    await user.click(
      await screen.findByRole("button", {
        name: /This information is correct/i,
      }),
    );

    const password = "This is a secure static passphrase";
    await user.type(screen.getByLabelText(/Email address/i), "new@example.com");
    await user.type(screen.getByLabelText(/^Create password/i), password);
    await user.type(screen.getByLabelText(/^Confirm password/i), password);
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));

    const consents = await screen.findAllByRole("checkbox");
    for (const consent of consents) {
      await user.click(consent);
    }

    await user.click(
      screen.getByRole("button", { name: /Create static account/i }),
    );

    expect(
      await screen.findByText(
        /Your demonstration account is ready for email verification/i,
      ),
    ).toBeInTheDocument();
  });
});
