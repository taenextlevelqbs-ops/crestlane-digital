import { test, expect, type Page } from "@playwright/test";

async function fillInquiry(page: Page) {
  await page.locator('[name="name"]').fill("Test Person");
  await page.locator('[name="email"]').fill("test@example.com");
  await page.locator('[name="details"]').fill("Please build a responsive business website.");
}

test("mobile menu supports keyboard, Escape, outside dismissal and destination focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  const mainNavigation = page.getByRole("navigation", { name: "Main navigation" });
  const rect = await toggle.boundingBox();
  expect(rect!.width).toBeGreaterThanOrEqual(44); expect(rect!.height).toBeGreaterThanOrEqual(44);
  await toggle.focus(); await page.keyboard.press("Enter");
  await expect(mainNavigation).toBeVisible();
  await page.keyboard.press("Tab"); await expect(mainNavigation.locator('a[href="#services"]')).toBeFocused();
  await page.keyboard.press("Escape"); await expect(mainNavigation).toBeHidden(); await expect(toggle).toBeFocused();
  await toggle.click(); await page.locator(".crestlane-logo-link").click(); await expect(mainNavigation).toBeHidden();
  await toggle.click(); await mainNavigation.locator('a[href="#work"]').click();
  await expect(mainNavigation).toBeHidden(); await expect(page.locator("#work")).toBeFocused();
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout and contact controls remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator(".studio-inquiry-details summary").click();
    await expect(page.getByRole("checkbox")).toHaveCount(5);
    await page.getByRole("checkbox", { name: "Automation & AI" }).check();
    await expect(page.getByRole("checkbox", { name: "Automation & AI" })).toBeChecked();
    await page.locator("#contact").screenshot({ path: `test-results/contact-${width}.png` });
  });
}

test("validation focuses fields and requires a phone for phone contact", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.locator('[name="name"]')).toBeFocused();
  await expect(page.locator("#error-name")).toHaveText("Enter your name.");
  await fillInquiry(page); await page.locator(".studio-inquiry-details summary").click();
  await page.locator('[name="contact"]').selectOption("Phone call");
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.locator('[name="phone"]')).toBeFocused();
  await expect(page.locator("#error-phone")).toContainText("phone number");
});

test("loading prevents duplicate sends; provider acceptance is not labeled delivered", async ({ page }) => {
  let release!: () => void; const gate = new Promise<void>((resolve) => { release = resolve; }); let calls = 0;
  await page.route("**/api/contact", async (route) => {
    calls++; await gate;
    await route.fulfill({ status: 202, json: { status: "accepted", reference: "test-reference", message: "The email service accepted your inquiry for sending. Inbox delivery has not yet been confirmed." } });
  });
  await page.goto("/"); await fillInquiry(page);
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled(); release();
  await expect(page.locator(".form-feedback")).toContainText("delivery has not yet been confirmed");
  await expect(page.getByRole("button", { name: "Accepted for sending" })).toBeDisabled();
  await expect(page.locator(".form-feedback")).toBeFocused(); expect(calls).toBe(1);
});

test("unavailable server and network errors preserve inquiry details", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ status: 503, json: { message: "Online inquiries are temporarily unavailable. Your inquiry has not been sent." } }));
  await page.goto("/"); await fillInquiry(page); await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.locator(".form-feedback")).toContainText("not been sent");
  await expect(page.locator('[name="details"]')).toHaveValue("Please build a responsive business website.");
  await page.unroute("**/api/contact"); await page.route("**/api/contact", (route) => route.abort());
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.locator(".form-feedback")).toContainText("could not confirm");
  await expect(page.getByRole("button", { name: "Send project inquiry" })).toBeEnabled();
});

test("existing filters, service selection and workflow interactions still work", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "Platforms & tools", exact: true }).click();
  await expect(page.locator(".studio-project")).toHaveCount(2);
  await page.getByRole("button", { name: "Business websites", exact: true }).click(); await expect(page.locator(".studio-project")).toHaveCount(3);
  await page.locator(".globe-destinations button").nth(3).click(); await page.getByRole("button", { name: "Explore this service" }).click();
  await expect(page.locator(".studio-service-detail h3")).toContainText("Security");
  await page.locator(".connected-types button").nth(1).click(); await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(page.locator(".connected-preview h4")).toHaveText("Coaches work from one list.");
});

test("portfolio identities load and the About process and footer navigation are present", async ({ page }) => {
  await page.goto("/");
  const identities = page.locator(".studio-project-visual img");
  await expect(identities).toHaveCount(5);
  for (let index = 0; index < await identities.count(); index++) {
    const image = identities.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((item: HTMLImageElement) => item.complete && item.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveAttribute("alt", /project identity/);
  }
  await expect(page.locator(".studio-process li")).toHaveCount(3);
  await page.getByRole("link", { name: "About Crestlane" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
});

test("case studies keep site navigation and fit phone, tablet and desktop widths", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/work/dmv-attack");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const navigation = page.getByRole("navigation", { name: "Case study navigation" });
    await expect(navigation.getByRole("link", { name: "Selected work" })).toBeVisible();
    await expect(navigation.getByRole("link", { name: /Start a project/ })).toBeVisible();
  }
});


test("case studies, canonical metadata, sitemap and robots are available", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Crestlane Digital \| Websites, Software & Automation/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://crestlanedigital.com");
  const sitemap = await page.request.get("/sitemap.xml"); expect(sitemap.ok()).toBe(true);
  const sitemapXml = await sitemap.text();
  for (const slug of ["nova-sports-live", "dmv-attack", "coach-tae-qb"]) expect(sitemapXml).toContain(`/work/${slug}`);
  const robots = await page.request.get("/robots.txt"); expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");
  for (const [slug, name] of [["nova-sports-live", "NOVA Sports Live"], ["dmv-attack", "DMV Attack"], ["coach-tae-qb", "Coach Tae QB"]]) {
    await page.goto(`/work/${slug}`); await expect(page.locator("h1")).toHaveText(name);
    await expect(page.getByText("THE CHALLENGE")).toBeVisible(); await expect(page.getByText("THE APPROACH")).toBeVisible();
    await expect(page.getByText("WHAT IT DOES")).toBeVisible(); await expect(page.getByRole("link", { name: /Visit the live project/ })).toHaveAttribute("href", /^https:\/\//);
  }
});

test("reduced motion draws a still globe without starting continuous animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    let count = 0;
    const native = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => { count++; return native(callback); };
    Object.defineProperty(window, "__frameCount", { get: () => count });
  });
  await page.goto("/"); await page.waitForTimeout(700);
  expect(await page.evaluate(() => (window as unknown as Window & { __frameCount: number }).__frameCount)).toBeLessThan(5);
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Motion reduced" })).toBeDisabled();
});
