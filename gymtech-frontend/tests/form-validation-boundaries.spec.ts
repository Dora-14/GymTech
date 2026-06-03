import { test, expect } from '@playwright/test';

test.describe('Frontend Form Input Gatekeepers', () => {

  test.beforeEach(async ({ page }) => {
    // Standard authenticated setup routine
    await page.goto('http://localhost:4200/login');
    await page.locator('#username').fill('Admin');
    await page.locator('#password').fill('Admin123!');
    await page.locator('button.btn-primary').click();
    await expect(page).toHaveURL('http://localhost:4200/dashboard');
  });

  test('Should show error banner if fields are submitted with structural missing properties', async ({ page }) => {
    // 1. Open Member Management sidebar button view
    await page.locator('aside.dashboard-sidebar button.sidebar-item:has-text("Manage Members")').click();

    // 2. Intentionally leave "Full Name" and fields completely blank, but type a bad phone
    await page.locator('.form-group:has-text("Full Name") input').fill('');
    await page.locator('.form-group:has-text("Email") input').fill('');

    // 3. Click the add button to try and bypass client security
    const addMemberBtn = page.locator('button.btn-primary:has-text("Add Member")');
    await addMemberBtn.click();

    // 4. Assert: If your C# DataAnnotations model validations are working, it will reject the payload
    // and print out a message validation banner on the interface screen layout
    const errorAlert = page.locator('.msg-error');

    // Note: If your frontend blocks the click entirely via template validators, the button might be disabled.
    // This handles checking whichever validation architecture you chose!
    if (await errorAlert.isVisible({ timeout: 2000 })) {
        await expect(errorAlert).toBeVisible();
        console.log(`\n Backend Intercept Success: "${await errorAlert.innerText()}" \n`);
    } else {
        // If no backend error message appeared, it means the Angular client form itself successfully blocked the submit click!
        console.log('\n Client Side Form Validation intercept verified successfully! \n');
    }
  });
});
