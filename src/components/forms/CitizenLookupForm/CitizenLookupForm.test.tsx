import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockCitizenNationalId } from "@/mocks/data/citizens";
import { CitizenLookupForm } from "./CitizenLookupForm";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("CitizenLookupForm", () => {
  it("returns the fake citizen through the mock gateway", async () => {
    const user = userEvent.setup();
    const onFound = vi.fn();
    render(<CitizenLookupForm onFound={onFound} />);

    await user.type(
      screen.getByLabelText(/Rwanda National ID/i),
      mockCitizenNationalId,
    );
    await user.click(
      screen.getByRole("button", { name: /Find citizen record/i }),
    );

    expect(onFound).toHaveBeenCalledTimes(1);
  });
});
