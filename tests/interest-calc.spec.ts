import { test, expect } from "@playwright/test";

test.describe("Interest Calculator Tests", () => {
	test("should load the interest calculator main page", async ({ page }) => {
		await page.goto("/");

		await expect(
			page.locator('a[title="Manage"][href="/Account/Manage"]')
		).toHaveText("Hello jasperbailey98@gmail.com!"); //TODO .env this
	});
});
