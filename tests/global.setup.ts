import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "..", ".auth", "user.json");

test("global setup", async ({ browser }) => {
	// Create the .auth directory if it doesn't exist
	const authDir = path.dirname(authFile);
	if (!fs.existsSync(authDir)) {
		fs.mkdirSync(authDir, { recursive: true });
	}

	const context = await browser.newContext({ ignoreHTTPSErrors: true });
	const page = await context.newPage();

	await page.goto("/");

	await expect(page).toHaveTitle(/Home Page - Ten10TechTest/i);

	await page.getByRole("button", { name: "Login" }).click();
	await expect(page).toHaveTitle(" - Ten10TechTest");

	await page.locator("#UserName").fill("jasperbailey98@gmail.com"); //TODO put in .env
	await page.locator("#Password").fill("3Yue8CWz8eqGFam!"); //TODO put in .env
	await page.locator("#RememberMe").click();
	await page.locator("#login-submit").click();

	await expect(page).toHaveTitle("Home Page - Ten10TechTest");

	// Save the authentication state to a file
	await context.storageState({ path: authFile });

	await context.close();
});
