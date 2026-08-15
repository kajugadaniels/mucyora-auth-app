import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4000";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ["list"],
        ["html", { outputFolder: "reports/playwright", open: "never" }],
    ],
    outputDir: "reports/playwright-artifacts",
    expect: {
        timeout: 7_000,
        toHaveScreenshot: {
            animations: "disabled",
            caret: "hide",
            maxDiffPixelRatio: 0.01,
        },
    },
    use: {
        baseURL,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        actionTimeout: 8_000,
        navigationTimeout: 15_000,
    },
    webServer: {
        command: "npm run start",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "mobile-chromium",
            use: {
                ...devices["Pixel 7"],
            },
        },
    ],
});
