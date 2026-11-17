import AxeBuilder from "@axe-core/playwright";
import { expect, gotoInTheme, test } from "./fixtures";

// The Indonesian version of every app page (docs/i18n.md). The welcome page
// is English only.
const pages = [
  "/id/app",
  "/id/tier-list",
  "/id/statistics",
  "/id/heroes",
  "/id/heroes/fanny",
  "/id/items",
  "/id/emblems",
  "/id/counter-pick?enemies=fanny,ling",
  "/id/matchup?hero=khufra&vs=fanny",
  "/id/team-composition?team=khufra,valentina,claude,fredrinn,joy",
  "/id/draft",
  "/id/about",
] as const;

const DISCLAIMER_ID =
  "Situs ini nggak berafiliasi sama Moonton dan bukan situs resmi.";

for (const path of pages) {
  test(`${path} is in Indonesian and passes axe`, async ({ page }) => {
    await gotoInTheme(page, path, "light");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("footer").getByText(DISCLAIMER_ID)).toBeVisible();
    // Every link inside the app stays in Indonesian, apart from the language
    // switch (marked with hreflang), which leads to the English page.
    const hrefs = await page
      .locator(
        "main a[href^='/']:not([hreflang]), nav a[href^='/']:not([hreflang])",
      )
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );
    expect(
      hrefs.filter((href) => href !== "/" && !href.startsWith("/id")),
      "app links without the /id prefix",
    ).toEqual([]);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`),
    ).toEqual([]);
  });
}

test("/id leads to the Indonesian app start", async ({ page }) => {
  await page.goto("/id");
  await expect(page).toHaveURL(/\/id\/app$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("the language switch keeps the page and its filters", async ({
  page,
  isMobile,
}) => {
  await page.goto("/tier-list?rank=glory");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  if (isMobile) {
    await page.getByRole("link", { name: "Bahasa Indonesia" }).click();
  } else {
    await page
      .getByRole("navigation", { name: "Language" })
      .getByRole("link", { name: "Bahasa Indonesia" })
      .click();
  }
  await expect(page).toHaveURL(/\/id\/tier-list\?rank=glory$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");

  if (isMobile) {
    await page.getByRole("link", { name: "English" }).click();
  } else {
    await page
      .getByRole("navigation", { name: "Bahasa" })
      .getByRole("link", { name: "English" })
      .click();
  }
  await expect(page).toHaveURL(/\/tier-list\?rank=glory$/);
  await expect(page).not.toHaveURL(/\/id\//);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("an unknown Indonesian URL shows the Indonesian not-found page", async ({
  page,
}) => {
  await page.goto("/id/heroes/not-a-hero");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Halamannya nggak ada",
  );
  await page.goto("/id/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Halamannya nggak ada",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("an unknown English URL shows the app's not-found page", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This page does not exist",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("numbers use a decimal comma in Indonesian", async ({ page }) => {
  await page.goto("/id/statistics");
  const firstRate = page
    .locator("main")
    .getByText(/^\d{1,2},\d%$/)
    .first();
  await expect(firstRate).toBeVisible();
});
