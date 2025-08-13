import type { Page } from "@playwright/test";
import {
	consentButton,
	interestPeriodButton,
	interestRateButton,
	interestRateDropdown,
	principalAmount,
} from "../locators/interest-calc-locators.js";
import type { InterestPeriod } from "../types/interest-period.types.js";

/**
 * Helper function to be used in a test to fill the interest calculator form.
 * Does not submit the form.
 * @param page
 * @param options `principalAmount` is between 100 and 15000 in increments of 100.
 *
 * `interestRate` is between 1 and 15 in increments of 1.
 *
 * Parameters not given will be left unfilled.
 */
export const fillForm = async (
	page: Page,
	options: {
		principalAmount?: number;
		interestRate?: number;
		interestPeriod?: InterestPeriod;
		consent?: boolean;
	}
) => {
	if (
		typeof options.principalAmount === "number" &&
		options.principalAmount % 100 === 0 &&
		options.principalAmount >= 0 &&
		options.principalAmount <= 15000
	) {
		await principalAmount(page).fill(String(options.principalAmount));
	}

	if (
		typeof options.interestRate === "number" &&
		Number.isInteger(options.interestRate) &&
		options.interestRate >= 1 &&
		options.interestRate <= 15
	) {
		await interestRateDropdown(page).click();
		await interestRateButton(page, options.interestRate).check();
		await page.locator("body").click(); //Click away to close the dropdown
	}

	if (options.interestPeriod) {
		await interestPeriodButton(page, options.interestPeriod).click();
	}

	if (options.consent) {
		await consentButton(page).check();
	}
};
