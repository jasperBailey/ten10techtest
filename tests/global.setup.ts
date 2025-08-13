import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "..", ".auth", "user.json");

test("global setup", async ({ browser }) => {
	// Create the .auth directory if it doesn't exist
	const authDir = path.dirname(authFile);
	if (!fs.existsSync(authDir)) {
		fs.mkdirSync(authDir, { recursive: true });
	}

	// test site doesn't use https >:(
	const context = await browser.newContext({ ignoreHTTPSErrors: true });
	const page = await context.newPage();

	await page.goto("/Account/Login");
	await expect(page).toHaveTitle(" - Ten10TechTest");

	await page.locator("#UserName").fill(process.env.TEST_USER_EMAIL || "");
	await page.locator("#Password").fill(process.env.TEST_USER_PASSWORD || "");
	await page.locator("#RememberMe").click();
	await page.locator("#login-submit").click();

	await expect(page).toHaveTitle("Home Page - Ten10TechTest");

	// Save the authentication state to a file
	await context.storageState({ path: authFile });

	await context.close();
});
