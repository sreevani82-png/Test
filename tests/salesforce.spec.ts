import { test, expect } from '@playwright/test';

test('Verify Salesforce Login and Home Page Tabs', async ({ page }) => {
  // Set test timeout to 2 minutes to allow time for OTP verification
  test.setTimeout(120000);

  // Go to Salesforce login page
  console.log('Navigating to Salesforce login page...');
  await page.goto('https://login.salesforce.com');

  // Fill in login details
  console.log('Entering username and password...');
  await page.fill('#username', 'vanij1282.2869fc3bc4a9@agentforce.com');
  await page.fill('#password', 'Sreevani@1282');
  
  // Click Login button
  console.log('Clicking login button...');
  await page.click('#Login');

  // Wait to see if we get a verification page or successfully log in
  await page.waitForTimeout(5000);

  // Take a screenshot to inspect current state
  await page.screenshot({ path: 'salesforce-login-status.png' });
  console.log('Screenshot saved as salesforce-login-status.png');

  // Check if we are prompted for a verification code
  const verificationInput = page.locator('#emc');
  if (await verificationInput.isVisible()) {
    console.log('Verification code (OTP) is required! Please check your email and write the code to "otp.txt" in the workspace directory.');
    const fs = require('fs');
    const path = require('path');
    const otpFilePath = path.join(__dirname, '../otp.txt');
    
    // Clean up old otp.txt if it exists
    if (fs.existsSync(otpFilePath)) {
      fs.unlinkSync(otpFilePath);
    }
    
    let otp = '';
    const timeout = 120000; // 2 minutes
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (fs.existsSync(otpFilePath)) {
        otp = fs.readFileSync(otpFilePath, 'utf8').trim();
        if (otp) {
          console.log(`Read OTP from otp.txt: ${otp}`);
          break;
        }
      }
      await page.waitForTimeout(2000);
    }
    
    if (!otp) {
      throw new Error('Timeout waiting for OTP in otp.txt');
    }
    
    await verificationInput.fill(otp);
    await page.click('#save'); // Usually '#save' is the verification submit button
    await page.waitForTimeout(5000);
    
    // Clean up the file
    try {
      fs.unlinkSync(otpFilePath);
    } catch (e) {}
  }

  // Wait for landing/home page to load
  console.log('Waiting for Home page tabs or dashboard...');
  // Usually, Salesforce home page has a list of navigation tabs.
  // Let's wait for navigation or specific elements
  await page.waitForURL(/.*lightning\/page\/home|.*lightning\/setup\/SetupOneHome.*/, { timeout: 30000 }).catch(() => {
    console.log('Failed to detect Home URL, checking current URL:', page.url());
  });

  await page.screenshot({ path: 'salesforce-home.png' });
  console.log('Screenshot of page state saved as salesforce-home.png');

  // Let's locate the navigation bar/tabs
  // In Lightning, tabs are usually in <one-app-nav-bar> or elements inside navigation bar
  console.log('Looking for navigation tabs...');
  const tabs = page.locator('one-app-nav-bar-item-root, .slds-context-bar__item');
  const count = await tabs.count();
  console.log(`Found ${count} navigation tabs on home page:`);
  for (let i = 0; i < count; i++) {
    const text = await tabs.nth(i).textContent();
    console.log(`Tab ${i + 1}: ${text?.trim()}`);
  }
});
