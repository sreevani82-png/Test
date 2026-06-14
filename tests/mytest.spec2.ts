import { test, expect } from '@playwright/test';
test("Verify the URL of the page", async ({ page }) => {
    await page.goto("https://automationexercise.com/");
    let url: string = await page.url()
    console.log("URL:", url);
    await expect(page).toHaveURL("https://automationexercise.com/");
})