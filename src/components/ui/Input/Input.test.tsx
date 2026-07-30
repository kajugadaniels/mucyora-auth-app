import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import { Input } from "./Input";

describe("Input", () => {
  it("associates an inline error with the control", () => {
    render(
      <Input
        label="Email address"
        icon={<Mail />}
        error="Enter a valid email address."
      />,
    );
    const input = screen.getByRole("textbox", { name: /email address/i });
    const error = screen.getByRole("alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
  });
});
