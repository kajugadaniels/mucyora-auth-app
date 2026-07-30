import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${rootDirectory}src`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/components/ui/**/*.{ts,tsx}",
        "src/components/auth/**/*.{ts,tsx}",
        "src/components/forms/**/*.{ts,tsx}",
        "src/hooks/**/*.ts",
        "src/lib/**/*.ts",
        "src/mocks/**/*.ts",
        "src/services/**/*.ts",
        "src/state/**/*.{ts,tsx}",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/index.ts"],
    },
  },
});