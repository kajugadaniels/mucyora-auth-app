import { expect, test } from "@playwright/test";

test("login is usable using the keyboard only", async ({
    page,
}) => {
    await page.goto("/login/");

    await page.keyboard.press("Tab");
    await expect(
        page.getByRole("link", {
            name: "Skip to authentication content",
        }),
    ).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(
        page.locator("#auth-main"),
    ).toBeFocused();

    const email = page.getByLabel("Email address");
    await email.focus();
    await page.keyboard.type("user@mucyora.test");

    await page.keyboard.press("Tab");
    const password = page.getByLabel("Password");
    await expect(password).toBeFocused();
    await page.keyboard.type("MucyoraDemo123!");

    await page.getByRole("button", {
        name: "Sign in",
    }).focus();

    await page.keyboard.press("Enter");

    await expect(
        page.getByText("Static sign-in completed"),
    ).toBeVisible();
});

test("route navigation moves focus to the new page title", async ({
    page,
}) => {
    await page.goto("/");

    await page
        .getByRole("link", {
            name: "Sign in securely",
        })
        .click();

    await expect(
        page.getByRole("heading", {
            level: 1,
            name: "Sign in to MUCYORA",
        }),
    ).toBeFocused();
});
