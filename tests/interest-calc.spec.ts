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

	test("should calculate daily interest correctly", async ({ page }) => {
		// ARRANGE
		await page.goto("/");

		await page.locator(".custom-range").fill("5000");

		await page.locator("#dropdownMenuButton").click();
		await page.locator("#rate-5\\%").check();

		await expect(page.locator("#durationList a.active")).toHaveAttribute(
			"data-value",
			"Daily"
		);

		await page.locator("#gridCheck1").check();

		// ACT
		await page.locator("button.btn-primary").click();

		// ASSERT
		await expect(page.locator("#interestAmount")).toContainText("0.68");
		await expect(page.locator("#totalAmount")).toContainText("5000.68");
	});

	test("should calculate monthly interest correctly", async ({ page }) => {
		//ARRANGE
		await page.goto("/");

		await page.locator(".custom-range").fill("10000");

		await page.locator("#dropdownMenuButton").click();
		await page.locator("#rate-10\\%").check();

		await page.locator("body").click();

		await page.locator('#durationList a[data-value="Monthly"]').click();

		await page.locator("#gridCheck1").check();

		// ACT
		await page.locator("button.btn-primary").click();

		// ASSERT
		await expect(page.locator("#interestAmount")).toContainText("83.33");
		await expect(page.locator("#totalAmount")).toContainText("10083.33");
	});

	test("should calculate yearly interest correctly", async ({ page }) => {
		//ARRANGE
		await page.goto("/");

		await page.locator(".custom-range").fill("15000");

		await page.locator("#dropdownMenuButton").click();
		await page.locator("#rate-15\\%").check();
		await page.locator("body").click();

		await page.locator('#durationList a[data-value="Yearly"]').click();

		await page.locator("#gridCheck1").check();

		//ACT
		await page.locator("button.btn-primary").click();

		//ASSERT
		await expect(page.locator("#interestAmount")).toContainText("2250.00");
		await expect(page.locator("#totalAmount")).toContainText("17250.00");
	});
});
