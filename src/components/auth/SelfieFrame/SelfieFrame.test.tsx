import { render, screen } from "@testing-library/react";
import { SelfieFrame } from "./SelfieFrame";
describe("SelfieFrame", () => {
  it("announces simulated progress", () => {
    render(<SelfieFrame state="capturing" progress={42} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "42",
    );
  });
});
