import { test, expect } from '@playwright/test';

test('Angular frontend successfully logs in via C# Backend API', async ({ page }) => {

  const angularUrl = 'http://localhost:4200/login';

  await page.goto(angularUrl);

  await page.locator('#username').fill('Admin');
  await page.locator('#password').fill('Admin123!');

  await page.locator('button.btn-primary').click();

  await expect(page).toHaveURL('http://localhost:4200/dashboard');

  const headerUserMessage = page.locator('text=Welcome, Admin');
  await expect(headerUserMessage).toBeVisible();

  const mainDashboardTitle = page.locator('text=Welcome to GymTech Admin Dashboard');
  await expect(mainDashboardTitle).toBeVisible();
});
test('Logout button destroys user context and enforces route restrictions', async ({ page }) => {

  await page.goto('http://localhost:4200/login');
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('Admin123!');
  await page.locator('button.btn-primary').click();
  await expect(page).toHaveURL('http://localhost:4200/dashboard');

  await page.locator('button:has-text("Logout")').click();

  await expect(page).toHaveURL('http://localhost:4200/login');

  await page.goto('http://localhost:4200/dashboard');

  await expect(page).toHaveURL('http://localhost:4200/login');
});
