import { render, screen } from "@testing-library/react";
import { MessageSquareText } from "lucide-react";
import { TextareaField } from "./TextareaField";

describe("TextareaField", () => {
  it("announces a controlled character count", () => {
    render(
      <TextareaField
        label="Reason"
        icon={<MessageSquareText />}
        value="Hello"
        onChange={() => undefined}
        maxLength={20}
        showCharacterCount
      />,
    );
    expect(screen.getByText("5/20")).toBeInTheDocument();
  });
});