import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("is usable through its visible label", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="I agree" />);
    const checkbox = screen.getByRole("checkbox", { name: /i agree/i });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
