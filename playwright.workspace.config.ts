import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/workspace",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3006",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: {
    command: "node tests/fixtures/workspace-server.mjs",
    url: "http://127.0.0.1:3006/portal/login",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
