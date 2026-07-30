import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";
import { ImageField } from "./ImageField";

function Harness() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <ImageField
      label="Identity image"
      accept={["image/png"]}
      maxSizeBytes={1024 * 1024}
      value={file}
      onChange={setFile}
    />
  );
}

describe("ImageField", () => {
  it("validates and previews a local image without uploading", async () => {
    const user = userEvent.setup();
    const createSpy = vi.spyOn(URL, "createObjectURL");
    render(<Harness />);
    const input = screen.getByLabelText("Identity image");
    await user.upload(
      input,
      new File(["image"], "identity.png", { type: "image/png" }),
    );
    expect(await screen.findByAltText("Selected preview")).toBeInTheDocument();
    expect(createSpy).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /remove selected image/i }),
    ).toBeInTheDocument();
  });

  it("shows a local error for an unsupported file", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.upload(
      screen.getByLabelText("Identity image"),
      new File(["text"], "notes.txt", { type: "text/plain" }),
      { applyAccept: false },
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      /choose one of these image types/i,
    );
  });
});
