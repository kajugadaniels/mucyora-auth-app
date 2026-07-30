import { render, screen } from "@testing-library/react";
import { StatusIcon } from "./StatusIcon";

describe("StatusIcon", () => {
  it("communicates status with an accessible label", () => {
    render(<StatusIcon variant="success" label="Verification successful" />);
    expect(
      screen.getByRole("img", { name: /verification successful/i }),
    ).toBeInTheDocument();
  });
});