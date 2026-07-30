import { act, render, screen } from "@testing-library/react";
import { RouteAccessibilityManager } from ".";

const navigation = vi.hoisted(() => ({
  pathname: "/login",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

describe("RouteAccessibilityManager", () => {
  it("announces and focuses a new route heading", async () => {
    const { rerender } = render(
      <>
        <h1 id="auth-page-title" tabIndex={-1}>
          Sign in
        </h1>
        <RouteAccessibilityManager />
      </>,
    );

    navigation.pathname = "/create-account";

    rerender(
      <>
        <h1 id="auth-page-title" tabIndex={-1}>
          Create account
        </h1>
        <RouteAccessibilityManager />
      </>,
    );

    await act(async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 5));
    });

    expect(screen.getByText("Loaded Create account.")).toBeInTheDocument();

    expect(document.querySelector("#auth-page-title")).toHaveFocus();
  });
});
