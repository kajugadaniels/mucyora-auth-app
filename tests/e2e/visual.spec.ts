import { expect, test } from "@playwright/test";
import { stableVisualRoutes } from "./routes";

for (const route of stableVisualRoutes) {
    test(`visual baseline: ${route.name}`, async ({
        page,
    }) => {
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");

        await expect(page).toHaveScreenshot(
            `${route.name}.png`,
            {
                fullPage: true,
            },
        );
    });
}
