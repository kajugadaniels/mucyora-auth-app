import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { OtpInput } from "./OtpInput";

function Harness() {
  const [value, setValue] = useState("");
  return (
    <>
      <OtpInput label="Verification code" value={value} onChange={setValue} />
      <output>{value}</output>
    </>
  );
}

describe("OtpInput", () => {
  it("accepts a complete pasted code", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const first = screen.getByRole("textbox", { name: /digit 1 of 6/i });
    await user.click(first);
    await user.paste("123456");
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("moves backward when backspace is pressed on an empty cell", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const second = screen.getByRole("textbox", { name: /digit 2 of 6/i });
    await user.click(second);
    await user.keyboard("{Backspace}");
    expect(
      screen.getByRole("textbox", { name: /digit 1 of 6/i }),
    ).toHaveFocus();
  });
});
