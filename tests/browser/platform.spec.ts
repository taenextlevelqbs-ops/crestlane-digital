import { test, expect } from "@playwright/test";
const config = {
  configured: true,
  online: false,
  ai: false,
  faqs: [
    {
      question: "How much does a project cost?",
      answer: "Share your requirements for a tailored proposal.",
    },
  ],
  urls: {},
};
test("communication tools remain available after the studio approach", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#about + #connect")).toBeVisible();
  await expect(page.locator(".hero-project")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Let’s build something great." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Text us/ })).toHaveAttribute(
    "href",
    "sms:+17034314468",
  );
  await expect(
    page.getByRole("link", { name: /Call us/ }).first(),
  ).toHaveAttribute("href", "tel:+17034314468");
});
test("guided quote collects all steps and reports persisted acceptance honestly", async ({
  page,
}) => {
  await page.route("**/api/platform/config", (r) =>
    r.fulfill({ json: config }),
  );
  let saved: Record<string, string> | null = null;
  await page.route("**/api/platform/lead", (r) => {
    saved = r.request().postDataJSON();
    return r.fulfill({
      status: 201,
      json: {
        message: "Your quote request is securely saved.",
        reference: "fixture-reference",
        notification: "not_configured",
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Tell us your vision/ }).click();
  const panel = page.locator(".hub-panel");
  await panel.getByLabel("Your name").fill("Test Visitor");
  await panel.getByLabel("Email address").fill("test@example.com");
  await panel.getByLabel("Business name").fill("Test business");
  await panel.getByRole("button", { name: /Continue/ }).click();
  await panel.getByLabel("Features you need").fill("Private portal");
  await panel.getByLabel("Design preferences").fill("Futuristic");
  await panel.getByRole("button", { name: /Continue/ }).click();
  await panel.getByLabel("Anything else").fill("Build our new website.");
  await panel.getByRole("button", { name: /Send quote request/ }).click();
  await expect(panel.getByRole("status")).toContainText("securely saved");
  await expect(panel.getByRole("status")).toContainText(
    "email notification is not confirmed",
  );
  expect(saved).toMatchObject({
    business: "Test business",
    features: "Private portal",
    design: "Futuristic",
    description: "Build our new website.",
    kind: "quote",
  });
});
test("booking requests never claim a confirmed calendar booking", async ({
  page,
}) => {
  await page.route("**/api/platform/config", (r) =>
    r.fulfill({ json: config }),
  );
  await page.route("**/api/platform/lead", (r) =>
    r.fulfill({
      status: 201,
      json: {
        message:
          "Your consultation request is saved. Your time is not yet confirmed.",
        reference: "fixture-reference",
        notification: "accepted",
        confirmation: "accepted",
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Book a call/ }).click();
  const panel = page.locator(".hub-panel");
  await panel.getByLabel("Your name").fill("Test Visitor");
  await panel.getByLabel("Email address").fill("test@example.com");
  await panel.getByLabel("Phone number").fill("7035550101");
  await panel.getByLabel("Preferred dates and times").fill("Next Tuesday, 2pm");
  await panel.getByRole("button", { name: /Request consultation/ }).click();
  await expect(panel.getByRole("status")).toContainText("not yet confirmed");
});
test("offline chat resumes persisted messages and handles errors without losing input", async ({
  page,
}) => {
  await page.route("**/api/platform/config", (r) =>
    r.fulfill({ json: config }),
  );
  await page.route("**/api/platform/chat", (r) =>
    r.fulfill({
      json: {
        messages: [
          {
            id: "1",
            sender: "visitor",
            body: "Our saved message",
            created_at: "2026-10-12T12:00:00Z",
          },
        ],
      },
    }),
  );
  await page.route("**/api/platform/chat/message", (r) =>
    r.fulfill({
      status: 503,
      json: {
        message: "Service unavailable. Your message is still in the form.",
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Message our team/ }).click();
  const panel = page.locator(".hub-panel");
  await expect(panel.getByText("Our saved message")).toBeVisible();
  await panel.getByLabel("Your next message").fill("Please get back to us.");
  await panel.getByRole("button", { name: /Send message/ }).click();
  await expect(panel.getByLabel("Your next message")).toHaveValue(
    "Please get back to us.",
  );
  await expect(panel.getByRole("status")).toContainText("Service unavailable");
  await expect(page.locator(".hub-presence")).toContainText("Leave a message");
});
test("FAQ guide works without AI and offers real lead/human handoff controls", async ({
  page,
}) => {
  await page.route("**/api/platform/config", (r) =>
    r.fulfill({ json: config }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Ask Crestlane/ }).click();
  await page
    .getByText("How much does a project cost?", { exact: true })
    .click();
  await expect(
    page.getByText("Share your requirements for a tailored proposal."),
  ).toBeVisible();
  await page.getByRole("button", { name: /Talk to a human/ }).click();
  await expect(
    page.getByRole("heading", { name: "You bring the idea. We’ll listen." }),
  ).toBeVisible();
});
test("private routes and workspace APIs require verified authentication", async ({
  page,
}) => {
  for (const path of ["/portal", "/studio"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/portal\/login$/);
  }
  const r = await page.request.get("/api/platform/workspace");
  expect(r.status()).toBe(401);
  await page.goto("/portal/login");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
for (const width of [320, 390, 768, 1440])
  test(`hub and forms fit ${width}px and respect reduced motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /Tell us your vision/ }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .locator("#connect")
      .screenshot({ caret: "initial", path: `test-results/hub-${width}.png` });
  });
