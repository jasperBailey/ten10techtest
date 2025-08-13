import type { Page } from "@playwright/test";

export function principalAmount(page: Page) {
	return page.locator(".custom-range");
}

export function interestRateDropdown(page: Page) {
	return page.locator("#dropdownMenuButton");
}

export function activeInterestPeriod(page: Page) {
	return page.locator("#durationList a.active");
}

export function consentButton(page: Page) {
	return page.locator("#gridCheck1");
}

export function submit(page: Page) {
	return page.locator("button.btn-primary");
}

export function interestAmount(page: Page) {
	return page.locator("#interestAmount");
}

export function totalAmount(page: Page) {
	return page.locator("#totalAmount");
}

export function interestRateButton(page: Page, rate: number) {
	if (rate < 0 || rate > 15 || !Number.isInteger(rate)) {
		throw new Error("interest rate must be integer between 0 and 15");
	}
	return page.locator(`#rate-${rate.toString()}\\%`).check();
}
