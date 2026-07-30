import { render, screen } from "@testing-library/react";
import { AuthCard } from "./AuthCard";

describe("AuthCard", () => {
  it("associates the page region with its heading and description", () => {
    render(
      <AuthCard title="Secure page" description="Safe description">
        <p>Content</p>
      </AuthCard>,
    );

    const region = screen.getByRole("region", {
      name: "Secure page",
    });

    expect(region).toHaveAttribute("aria-describedby", "auth-page-description");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Secure page",
      }),
    ).toHaveAttribute("tabindex", "-1");
  });
});
