import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("clamps values to a valid percentage", () => {
    render(<ProgressBar label="Upload" value={140} showValue />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
