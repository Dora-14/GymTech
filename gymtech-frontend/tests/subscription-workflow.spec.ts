import { test, expect } from '@playwright/test';

test('Should dynamically load member profile and assign a new subscription plan', async ({ page }) => {

  await page.goto('http://localhost:4200/login');
  await page.locator('#username').fill('Admin');
  await page.locator('#password').fill('Admin123!');
  await page.locator('button.btn-primary').click();
  await expect(page).toHaveURL('http://localhost:4200/dashboard');

  await page.locator('aside.dashboard-sidebar button.sidebar-item:has-text("Manage Members")').click();
  await page.locator('.form-group:has-text("Full Name") input').fill('Subscription Tester');
  await page.locator('.form-group:has-text("Email") input').fill('subtest@gymtech.ro');
  await page.locator('.form-group:has-text("Phone") input').fill('0722999999');
  await page.locator('.form-group:has-text("Date of Birth") input').fill('1990-01-01');
  await page.locator('button.btn-primary:has-text("Add Member")').click();

  const membersTable = page.locator('table.data-table');
  await expect(membersTable).toContainText('Subscription Tester');

  const rawMemberId = await membersTable.locator('tbody tr').first().locator('td').first().innerText();
  const cleanMemberId = rawMemberId.trim();
  console.log(`\n🔹 DYNAMIC MEMBER ID FOUND: ${cleanMemberId} 🔹\n`);

  await page.locator('aside.dashboard-sidebar button.sidebar-item:has-text("Manage Subscriptions")').click();

  const searchInput = page.locator('.search-bar input');
  await searchInput.fill(cleanMemberId);
  await page.locator('.search-bar button:has-text("Load")').click();

  const formCardHeader = page.locator(`h4:has-text("Create Subscription for Member #${cleanMemberId}")`);
  await expect(formCardHeader).toBeVisible({ timeout: 5000 });

  const formCard = page.locator('.form-card').nth(1);

  const selectDropdown = formCard.locator('select');
  await selectDropdown.selectOption({ label: 'Annual' });
  await selectDropdown.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })));

  const priceInput = formCard.locator('input[type="number"]').first();
  await priceInput.click();
  await priceInput.clear();
  await priceInput.fill('1200');
  await priceInput.evaluate(el => el.dispatchEvent(new Event('input', { bubbles: true })));

  const durationInput = formCard.locator('input[type="number"]').nth(1);
  await durationInput.click();
  await durationInput.clear();
  await durationInput.fill('365');
  await durationInput.evaluate(el => el.dispatchEvent(new Event('input', { bubbles: true })));

  const dateInput = formCard.locator('input[type="date"]');
  await dateInput.click();
  await dateInput.clear();
  await dateInput.fill('2026-06-03');
  await dateInput.evaluate(el => el.dispatchEvent(new Event('input', { bubbles: true })));

  const submitButton = page.locator('button:has-text("Create Subscription")');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click();

  const dataTable = page.locator('table.data-table');
  await expect(dataTable).toBeVisible({ timeout: 10000 });

  await expect(dataTable).toContainText('Monthly');
  await expect(dataTable).toContainText('Active');
});
