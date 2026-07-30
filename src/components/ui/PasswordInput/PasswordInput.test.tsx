import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("toggles password visibility without changing the value", async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" defaultValue="safe-passphrase" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(input.type).toBe("text");
    expect(input.value).toBe("safe-passphrase");
  });
});
