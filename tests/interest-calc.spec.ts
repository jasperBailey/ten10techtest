import { test, expect } from "@playwright/test";
import {
	principalAmount,
	interestRateDropdown,
	activeInterestPeriod,
	consentButton,
	submitButton,
	interestAmount,
	totalAmount,
	interestRateButton,
} from "../src/locators/interest-calc-locators.js";
import { fillForm } from "../src/util/fill-form.js";

test.describe("Interest Calculator Tests", () => {
	test("should load the interest calculator main page", async ({ page }) => {
		// ARRANGE
		await page.goto("/");

		// ACT
		const manageLink = page.locator(
			'a[title="Manage"][href="/Account/Manage"]'
		);

		// ASSERT
		await expect(manageLink).toContainText(
			process.env.TEST_USER ??
				"I mean if there's nothing there in the env it shouldn't get to this point"
		);
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
			await submitButton(page).click();

			// ASSERT
			expect(dialogMessage).toBe("Please fill in all fields.");
		});

		test("should require consent checkbox", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await fillForm(page, {
				principalAmount: 5000,
				interestRate: 5,
				interestPeriod: "Daily",
				consent: false,
			});

			// ACT
			await submitButton(page).click();

			// ASSERT
			await expect(interestAmount(page)).toHaveText("");
			await expect(totalAmount(page)).toHaveText("");
		});
	});

	test.describe("calculation", () => {
		test("should calculate daily interest correctly", async ({ page }) => {
			// ARRANGE
			await page.goto("/");

			await fillForm(page, {
				principalAmount: 5000,
				interestRate: 5,
				interestPeriod: "Daily",
				consent: true,
			});

			// ACT
			await submitButton(page).click();

			// ASSERT
			await expect(interestAmount(page)).toContainText("0.68");
			await expect(totalAmount(page)).toContainText("5000.68");
		});

		test("should calculate monthly interest correctly", async ({
			page,
		}) => {
			//ARRANGE
			await page.goto("/");

			await fillForm(page, {
				principalAmount: 10000,
				interestRate: 10,
				interestPeriod: "Monthly",
				consent: true,
			});

			// ACT
			await submitButton(page).click();

			// ASSERT
			await expect(interestAmount(page)).toContainText("83.33");
			await expect(totalAmount(page)).toContainText("10083.33");
		});

		test("should calculate yearly interest correctly", async ({ page }) => {
			//ARRANGE
			await page.goto("/");

			await fillForm(page, {
				principalAmount: 15000,
				interestRate: 15,
				interestPeriod: "Yearly",
				consent: true,
			});

			//ACT
			await submitButton(page).click();

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

				await fillForm(page, {
					principalAmount: 1000,
					interestRate: rate,
					interestPeriod: "Yearly",
					consent: true,
				});

				// ACT
				await submitButton(page).click();

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
			await expect(submitButton(page)).toBeVisible();
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
			await expect(submitButton(page)).toBeVisible();
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
			await expect(submitButton(page)).toBeVisible();
		});
	});
});
