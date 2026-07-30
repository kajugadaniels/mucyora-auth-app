import { render, screen } from "@testing-library/react";
import { AccountStatusPanel } from "./AccountStatusPanel";
describe("AccountStatusPanel", () => {
  it("renders account-state guidance", () => {
    render(
      <AccountStatusPanel
        iconVariant="warning"
        iconLabel="Verification required"
        alertVariant="warning"
        alertTitle="Limited access"
        alertMessage="Complete verification."
        details={[{ label: "Next action", value: "Verify identity" }]}
        actions={<button>Continue</button>}
      />,
    );
    expect(screen.getByText("Verify identity")).toBeInTheDocument();
  });
});
