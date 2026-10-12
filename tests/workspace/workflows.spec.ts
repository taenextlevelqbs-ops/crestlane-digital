import { test, expect } from "@playwright/test";
async function login(page: import("@playwright/test").Page, role: string) {
  await page.goto("/portal/login");
  await page.getByLabel("Email address").fill(`${role}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page.getByRole("button", { name: /Sign in securely/ }).click();
}
test("client signs in, reads own project, sends a persistent message, and approves design", async ({
  page,
}) => {
  await login(page, "client");
  await expect(page).toHaveURL(/\/portal$/);
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Your message").fill("Please use our approved logo.");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(
    page.getByText("Please use our approved logo.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Feedback").fill("Ready for launch.");
  await page.getByRole("button", { name: "Send decision" }).click();
  await expect(
    page.getByText("Client feedback: Ready for launch."),
  ).toBeVisible();
  await page
    .getByLabel("Upload a file")
    .setInputFiles({
      name: "brief.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Project brief fixture"),
    });
  await page.getByRole("button", { name: "Upload securely" }).click();
  await expect(page.getByRole("button", { name: /brief.txt/ })).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Please use our approved logo.", { exact: true }),
  ).toBeVisible();
  await page.goto("/studio");
  await expect(page).toHaveURL(/\/portal$/);
  await page.getByRole("button", { name: /Sign out/ }).click();
  await expect(page).toHaveURL(/\/portal\/login$/);
});
test("staff workspace supports mobile project operations and approved knowledge", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page, "staff");
  await expect(page).toHaveURL(/\/studio$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
  await page.getByLabel("New milestone").fill("Final handoff");
  await page.getByRole("button", { name: "Add milestone" }).click();
  await expect(page.getByText("Final handoff", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Knowledge", exact: true }).click();
  await page
    .getByLabel("Question", { exact: true })
    .fill("Can you build a portal?");
  await page
    .getByLabel("Approved answer", { exact: true })
    .fill("Yes, portals are scoped around your business requirements.");
  await page.getByLabel("Publish answer", { exact: true }).check();
  await page.getByRole("button", { name: "Add knowledge" }).click();
  await expect(page.getByLabel("Question", { exact: true }).last()).toHaveValue(
    "Can you build a portal?",
  );
  await page.getByLabel("Available for chat").check();
  await expect(page.getByLabel("Available for chat")).toBeChecked();
  await page
    .locator(".workspace-main")
    .screenshot({ caret: "initial", path: "test-results/studio-mobile.png" });
});

test("guest and staff exchange persistent chat and consultation requires explicit availability review", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Message our team/ }).click();
  const panel = page.locator(".hub-panel");
  await panel.getByLabel("Your name").fill("Fixture visitor");
  await panel.getByLabel("Email address").fill("visitor@example.com");
  await panel.getByLabel("How can we help?").fill("We need a client portal.");
  await panel.getByRole("button", { name: /Send message/ }).click();
  await expect(
    panel.getByText("We need a client portal.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close conversation panel" }).click();
  await page.getByRole("button", { name: /Book a call/ }).click();
  await panel.getByLabel("Your name").fill("Fixture visitor");
  await panel.getByLabel("Email address").fill("visitor@example.com");
  await panel
    .getByLabel("How would you like to meet?")
    .selectOption("Google Meet");
  await panel
    .getByLabel("Preferred dates and times")
    .fill("Future Tuesday afternoon");
  await panel.getByRole("button", { name: /Request consultation/ }).click();
  await expect(panel.getByRole("status")).toContainText("not yet confirmed");
  await login(page, "staff");
  await page.getByRole("button", { name: /Inbox/ }).click();
  await page.getByRole("button", { name: /Fixture visitor/ }).click();
  await page
    .getByLabel("Reply", { exact: true })
    .fill("We can help. Please share your requirements.");
  await page.getByRole("button", { name: /Send reply/ }).click();
  await expect(
    page.getByText("We can help. Please share your requirements.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Consultations", exact: true })
    .click();
  await page.getByText("Review & confirm consultation").click();
  await page.getByLabel("Confirmed date & time").fill("2099-10-12T14:00");
  await page
    .getByLabel("Actual Google Meet / Zoom link")
    .fill("https://meet.google.com/fixture-only");
  await page.getByLabel("I checked actual calendar availability").check();
  await page.getByRole("button", { name: "Confirm & notify customer" }).click();
  await expect(page.getByText(/Confirmed:/)).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "email notification is not confirmed",
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Message our team/ }).click();
  await expect(
    page
      .locator(".hub-panel")
      .getByText("We can help. Please share your requirements.", {
        exact: true,
      }),
  ).toBeVisible();
});
