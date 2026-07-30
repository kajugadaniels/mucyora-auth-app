import { render, screen } from "@testing-library/react";
import { mockVerificationResults } from "@/mocks/data/verification-results";
import { VerificationResult } from "./VerificationResult";
describe("VerificationResult", () => {
  it("renders safe reason information", () => {
    render(
      <VerificationResult
        result={mockVerificationResults.success}
        actions={<button>Continue</button>}
      />,
    );
    expect(screen.getByText("VERIFICATION_PASSED")).toBeInTheDocument();
  });
});
