import { expect, test } from "@playwright/test";
import { authRoutes } from "./routes";

for (const route of authRoutes) {
    test(`does not contact an external origin: ${route}`, async ({
        page,
    }) => {
        const externalRequests: string[] = [];

        page.on("request", (request) => {
            const url = new URL(request.url());

            if (
                !["127.0.0.1", "localhost"].includes(
                    url.hostname,
                ) &&
                !["data:", "blob:"].includes(url.protocol)
            ) {
                externalRequests.push(request.url());
            }
        });

        await page.goto(route);
        await page.waitForLoadState("networkidle");

        expect(externalRequests).toEqual([]);
    });
}
