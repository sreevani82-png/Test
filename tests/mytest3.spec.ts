import {test,expect} from '@playwright/test';
test("Verify the title of the page",async({page})=>{
await page.goto("https://automationexercise.com/");
let title:string = await page.title()
console.log("Title:", title);
await expect(page).toHaveTitle("Automation Exercise");
})

test("Verify Signup / Login button is visible", async ({ page }) => {
  await page.goto("https://automationexercise.com/");
  const signupLoginBtn = page.getByRole('link', { name: 'Signup / Login' });
  await expect(signupLoginBtn).toBeVisible();
})