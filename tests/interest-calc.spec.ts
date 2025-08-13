import { test, expect } from "@playwright/test";

test.describe("Interest Calculator Tests", () => {
	test("should load the interest calculator main page", async ({ page }) => {
		// ARRANGE
		await page.goto("/");

		// ACT
		const manageLink = page.locator(
			'a[title="Manage"][href="/Account/Manage"]'
		);

		// ASSERT
		await expect(manageLink).toHaveText("Hello jasperbailey98@gmail.com!"); //TODO .env this
	});

	test("should display all required form elements", async ({ page }) => {
		// ARRANGE
		await page.goto("/");

		// ACT
		const principalInput = page.locator(".custom-range");
		const rateDropdown = page.locator("#dropdownMenuButton");
		const durationList = page.locator("#durationList");
		const consentCheckbox = page.locator("#gridCheck1");
		const calculateButton = page.locator("button.btn-primary");

		// ASSERT
		await expect(principalInput).toBeVisible();
		await expect(rateDropdown).toBeVisible();
		await expect(durationList).toBeVisible();
		await expect(consentCheckbox).toBeVisible();
		await expect(calculateButton).toBeVisible();
	});

	test("should show error for empty fields when calculating", async ({
		page,
	}) => {
		// ARRANGE
		await page.goto("/");

		let dialogMessage = "";
		page.on("dialog", async (dialog) => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});

		// ACT
		await page.locator("button.btn-primary").click();

		// ASSERT
		expect(dialogMessage).toBe("Please fill in all fields.");
	});
});
