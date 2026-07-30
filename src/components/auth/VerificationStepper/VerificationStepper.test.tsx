import { render, screen } from "@testing-library/react";
import { VerificationStepper } from "./VerificationStepper";
describe("VerificationStepper", () => {
  it("marks the active step", () => {
    render(<VerificationStepper currentStep="document" />);
    expect(screen.getByText("Identity image").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });
});
