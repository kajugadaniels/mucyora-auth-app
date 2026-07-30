import { expect, test } from "@playwright/test";

const viewports = [
    { name: "small-mobile", width: 320, height: 568 },
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
    test(`login has no horizontal overflow at ${viewport.name}`, async ({
        page,
    }) => {
        await page.setViewportSize(viewport);
        await page.goto("/login/");

        const dimensions = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }));

        expect(dimensions.scrollWidth).toBeLessThanOrEqual(
            dimensions.clientWidth + 1,
        );
    });
}

test("essential controls remain usable at a 320px CSS viewport", async ({
    page,
}) => {
    await page.setViewportSize({
        width: 320,
        height: 800,
    });
    await page.goto("/create-account/");

    const buttons = page.getByRole("button");
    const count = await buttons.count();

    for (let index = 0; index < count; index += 1) {
        const box = await buttons.nth(index).boundingBox();

        if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
        }
    }
});
