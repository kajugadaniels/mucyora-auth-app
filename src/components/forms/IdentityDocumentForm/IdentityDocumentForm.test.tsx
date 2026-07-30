import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IdentityDocumentForm } from "./IdentityDocumentForm";
describe("IdentityDocumentForm", () => {
  it("previews a valid selected image", async () => {
    render(<IdentityDocumentForm />);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        files: [new File(["image"], "identity.png", { type: "image/png" })],
      },
    });
    await waitFor(() =>
      expect(screen.getByAltText("Selected image preview")).toBeInTheDocument(),
    );
  });
});
