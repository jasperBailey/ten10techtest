import { test, expect } from "@playwright/test";
import {
	principalAmount,
	interestRateDropdown,
	activeInterestPeriod,
	consentButton,
	submit,
	interestAmount,
	totalAmount,
	interestRateButton,
} from "../src/locators/interest-calc-locators.js";

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
			await submit(page).click();

			// ASSERT
			expect(dialogMessage).toBe("Please fill in all fields.");
		});

		test("should require consent checkbox", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await principalAmount(page).fill("5000");
			await interestRateDropdown(page).click();
			await interestRateButton(page, 5).check();
			await page.locator("body").click();

			// ACT
			await submit(page).click();

			// ASSERT
			await expect(interestAmount(page)).toHaveText("");
			await expect(totalAmount(page)).toHaveText("");
		});
	});

	test.describe("calculation", () => {
		test("should calculate daily interest correctly", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await principalAmount(page).fill("5000");

			await interestRateDropdown(page).click();
			await interestRateButton(page, 5).check();

			await expect(activeInterestPeriod(page)).toHaveAttribute(
				"data-value",
				"Daily"
			);

			await consentButton(page).check();

			// ACT
			await submit(page).click();

			// ASSERT
			await expect(interestAmount(page)).toContainText("0.68");
			await expect(totalAmount(page)).toContainText("5000.68");
		});

		test("should calculate monthly interest correctly", async ({
			page,
		}) => {
			//ARRANGE
			await page.goto("/");

			await principalAmount(page).fill("10000");

			await interestRateDropdown(page).click();
			await interestRateButton(page, 10).check();

			await page.locator("body").click();

			await page.locator('#durationList a[data-value="Monthly"]').click();

			await consentButton(page).check();

			// ACT
			await submit(page).click();

			// ASSERT
			await expect(interestAmount(page)).toContainText("83.33");
			await expect(totalAmount(page)).toContainText("10083.33");
		});

		test("should calculate yearly interest correctly", async ({ page }) => {
			//ARRANGE
			await page.goto("/");

			await principalAmount(page).fill("15000");

			await interestRateDropdown(page).click();
			await interestRateButton(page, 15).check();
			await page.locator("body").click();

			await page.locator('#durationList a[data-value="Yearly"]').click();

			await consentButton(page).check();

			//ACT
			await submit(page).click();

			//ASSERT
			await expect(interestAmount(page)).toContainText("2250.00");
			await expect(totalAmount(page)).toContainText("17250.00");
		});

		for (let rate = 1; rate <= 15; rate++) {
			test(`should handle different interest rates: ${rate}`, async ({
				page,
			}) => {
				// ARRANGE
				const expectedInterest = (1000 * (rate / 100)).toFixed(2);
				const expectedTotal = (1000 + 1000 * (rate / 100)).toFixed(2);

				await page.goto("/");

				await principalAmount(page).fill("1000");

				await page
					.locator('#durationList a[data-value="Yearly"]')
					.click();

				await consentButton(page).check();

				await interestRateDropdown(page).click();
				await interestRateButton(page, rate).check();

				await page.locator("body").click();

				// ACT
				await submit(page).click();

				// ASSERT
				await expect(interestAmount(page)).toContainText(
					expectedInterest
				);
				await expect(totalAmount(page)).toContainText(expectedTotal);
			});
		}
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
			await expect(principalAmount(page)).toBeVisible();
			await expect(interestRateDropdown(page)).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(consentButton(page)).toBeVisible();
			await expect(submit(page)).toBeVisible();
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
			await expect(principalAmount(page)).toBeVisible();
			await expect(interestRateDropdown(page)).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(consentButton(page)).toBeVisible();
			await expect(submit(page)).toBeVisible();
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
			await expect(principalAmount(page)).toBeVisible();
			await expect(interestRateDropdown(page)).toBeVisible();
			await expect(page.locator("#durationList")).toBeVisible();
			await expect(consentButton(page)).toBeVisible();
			await expect(submit(page)).toBeVisible();
		});
	});
});
