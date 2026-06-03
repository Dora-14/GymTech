import { test, expect } from '@playwright/test';

test.describe('Authentication Security Boundaries', () => {

  test('Should reject invalid credentials and display a localized backend error message', async ({ page }) => {
    // 1. Go to your Angular login screen
    await page.goto('http://localhost:4200/login');

    // 2. Type an email/username that doesn't exist in your C# identity database
    await page.locator('#username').fill('nonexistent_user@gymtech.ro');
    await page.locator('#password').fill('completelyWrongPassword123');

    // 3. Click the submit button
    await page.locator('button.btn-primary').click();

    // 4. Assert: The page must NOT redirect to the dashboard view
    await expect(page).not.toHaveURL('http://localhost:4200/dashboard');

    // 5. Assert: Check that your template's error paragraph mounts and displays feedback
    const errorMessageBlock = page.locator('.error-message');
    await expect(errorMessageBlock).toBeVisible({ timeout: 4000 });

    // Check that it contains text (like "Invalid credentials", "User not found", or whatever your backend outputs)
    await expect(errorMessageBlock).not.toBeEmpty();

    // Log the exact error to the console so you can see your beautiful error handling in action!
    console.log(`\n Verified Error Banner Text: "${await errorMessageBlock.innerText()}" \n`);
  });
});
