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

	test.describe("missing fields", () => {
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

		test("should require consent checkbox", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await page.locator(".custom-range").fill("5000");
			await page.locator("#dropdownMenuButton").click();
			await page.locator("#rate-5\\%").check();
			await page.locator("body").click();

			// ACT
			await page.locator("button.btn-primary").click();

			// ASSERT
			await expect(page.locator("#interestAmount")).toHaveText("");
			await expect(page.locator("#totalAmount")).toHaveText("");
		});
	});

	test.describe("calculation", () => {
		test("should calculate daily interest correctly", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await page.locator(".custom-range").fill("5000");

			await page.locator("#dropdownMenuButton").click();
			await page.locator("#rate-5\\%").check();

			await expect(
				page.locator("#durationList a.active")
			).toHaveAttribute("data-value", "Daily");

			await page.locator("#gridCheck1").check();

			// ACT
			await page.locator("button.btn-primary").click();

			// ASSERT
			await expect(page.locator("#interestAmount")).toContainText("0.68");
			await expect(page.locator("#totalAmount")).toContainText("5000.68");
		});

		test("should calculate monthly interest correctly", async ({
			page,
		}) => {
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
			await expect(page.locator("#interestAmount")).toContainText(
				"83.33"
			);
			await expect(page.locator("#totalAmount")).toContainText(
				"10083.33"
			);
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
			await expect(page.locator("#interestAmount")).toContainText(
				"2250.00"
			);
			await expect(page.locator("#totalAmount")).toContainText(
				"17250.00"
			);
		});
	});

	test.describe("responsive layout", () => {
		test("should be responsive on mobile", async ({ page }) => {
			// ARRANGE
			await page.setViewportSize({ width: 375, height: 667 });

			// ACT
			await page.goto("/");

			// ASSERT
			await expect(
				page.locator('h1:has-text("Interest Calculator")')
			).toBeVisible();
			await expect(page.locator(".custom-range")).toBeVisible();
			await expect(page.locator("#dropdownMenuButton")).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(page.locator("#gridCheck1")).toBeVisible();
			await expect(page.locator("button.btn-primary")).toBeVisible();
		});

		test("should be responsive on tablet", async ({ page }) => {
			// ARRANGE
			await page.setViewportSize({ width: 768, height: 1024 });
			// ACT
			await page.goto("/");

			// ASSERT
			await expect(
				page.locator('h1:has-text("Interest Calculator")')
			).toBeVisible();
			await expect(page.locator(".custom-range")).toBeVisible();
			await expect(page.locator("#dropdownMenuButton")).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(page.locator("#gridCheck1")).toBeVisible();
			await expect(page.locator("button.btn-primary")).toBeVisible();
		});

		test("should be responsive on desktop", async ({ page }) => {
			// ARRANGE
			await page.setViewportSize({ width: 1920, height: 1080 });
			// ACT
			await page.goto("/");

			// ASSERT
			await expect(
				page.locator('h1:has-text("Interest Calculator")')
			).toBeVisible();
			await expect(page.locator(".custom-range")).toBeVisible();
			await expect(page.locator("#dropdownMenuButton")).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(page.locator("#gridCheck1")).toBeVisible();
			await expect(page.locator("button.btn-primary")).toBeVisible();
		});
	});
});
