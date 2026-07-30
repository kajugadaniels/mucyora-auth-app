import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
    it("uses an alert role for error messages", () => {
        render(<Alert variant="error" title="Unable to continue">Review the highlighted fields.</Alert>);
        expect(screen.getByRole("alert")).toHaveTextContent("Unable to continue");
    });
});