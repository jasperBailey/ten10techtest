import { test, expect } from "@playwright/test";

test("should load the interest calculator login page", async ({ browser }) => {
	const context = await browser.newContext({ ignoreHTTPSErrors: true });
	const page = await context.newPage();

	await page.goto("/");

	await expect(page).toHaveTitle(/Home Page - Ten10TechTest/i);

	await context.close();
});
