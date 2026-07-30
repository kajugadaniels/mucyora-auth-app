import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { authRoutes } from "./routes";

for (const route of authRoutes) {
    test(`has no automatically detectable WCAG A/AA violations: ${route}`, async ({
        page,
    }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");

        const results = await new AxeBuilder({ page })
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
            ])
            .analyze();

        expect(results.violations).toEqual([]);
    });
}
