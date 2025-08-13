import { test, expect } from "@playwright/test";

test("should load the interest calculator login page", async ({ browser }) => {
	const context = await browser.newContext({ ignoreHTTPSErrors: true });
	const page = await context.newPage();

	await page.goto("/");

	await expect(page).toHaveTitle(/Home Page - Ten10TechTest/i);

	await page.getByRole("button", { name: "Login" }).click();
	await expect(page).toHaveTitle(" - Ten10TechTest");

	await page.locator("#UserName").fill("jasperbailey98@gmail.com");
	await page.locator("#Password").fill("3Yue8CWz8eqGFam!");
	await page.locator("#RememberMe").click();
	await page.locator("#login-submit").click();

	await expect(page).toHaveTitle("Home Page - Ten10TechTest");
	await context.close();
});
