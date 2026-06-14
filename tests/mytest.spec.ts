import {test,expect} from '@playwright/test';
test("Verify the title of the page",async({page})=>{
await page.goto("https://automationexercise.com/");
let title:string = await page.title()
console.log("Title:", title);
await expect(page).toHaveTitle("Automation Exercise");
})