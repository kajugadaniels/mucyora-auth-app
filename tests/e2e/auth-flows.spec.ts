import { expect, test } from "@playwright/test";

test("completes the static login success flow", async ({
    page,
}) => {
    await page.goto("/login/");

    await page
        .getByLabel("Email address")
        .fill("user@mucyora.test");

    await page
        .getByLabel("Password")
        .fill("MucyoraDemo123!");

    await page
        .getByRole("button", {
            name: "Sign in",
        })
        .click();

    await expect(
        page.getByText("Static sign-in completed"),
    ).toBeVisible();
});

test("shows inline validation without losing page context", async ({
    page,
}) => {
    await page.goto("/login/");

    await page
        .getByRole("button", {
            name: "Sign in",
        })
        .click();

    await expect(
        page.getByText("This field is required."),
    ).toBeVisible();

    await expect(
        page.getByText("Enter your password."),
    ).toBeVisible();
});

test("navigates the static identity-verification route chain", async ({
    page,
}) => {
    await page.goto("/identity-verification/");

    await page
        .getByRole("link", {
            name: "Continue to identity image",
        })
        .click();

    await expect(page).toHaveURL(
        /identity-verification\/document\/$/,
    );

    await page.goto(
        "/identity-verification/result/?state=retry",
    );

    await expect(
        page.getByRole("heading", {
            name: "Please try the live check again",
        }),
    ).toBeVisible();
});
