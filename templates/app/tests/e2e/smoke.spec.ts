import { expect, test } from "@playwright/test";

test.describe("Frontend Smoke", () => {
	test("landing page renders without runtime errors", async ({ page }) => {
		const pageErrors: string[] = [];
		page.on("pageerror", (error) => pageErrors.push(error.message));

		await page.goto("/");
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator("body")).toBeVisible();
		expect(pageErrors).toEqual([]);
	});

	test("login route renders without runtime errors", async ({ page }) => {
		const pageErrors: string[] = [];
		page.on("pageerror", (error) => pageErrors.push(error.message));

		await page.goto("/login");
		await expect(page).toHaveURL(/\/login$/);
		await expect(page.locator("body")).toBeVisible();
		expect(pageErrors).toEqual([]);
	});
});
