import { test, expect } from '@playwright/test';

test.describe('GymTech Admin Navigation & Management Pipeline', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.locator('#username').fill('Admin');
    await page.locator('#password').fill('Admin123!');
    await page.locator('button.btn-primary').click();
    await expect(page).toHaveURL('http://localhost:4200/dashboard');
  });

  test('Should navigate to Member Management and populate form fields successfully', async ({ page }) => {

    const manageMembersButton = page.locator('aside.dashboard-sidebar button.sidebar-item:has-text("Manage Members")');
    await manageMembersButton.click();

    const formHeading = page.locator('.form-card h4');
    await expect(formHeading).toContainText('Add New Member');

    await page.locator('.form-group:has-text("Full Name") input').fill('Dan Johnston');
    await page.locator('.form-group:has-text("Email") input').fill('dan.j@gymtech.ro');
    await page.locator('.form-group:has-text("Phone") input').fill('0722111333');
    await page.locator('.form-group:has-text("Date of Birth") input').fill('1995-06-15');

    await page.locator('button.btn-primary:has-text("Add Member")').click();

    const membersTable = page.locator('table.data-table');
    await expect(membersTable).toContainText('Dan Johnston');
  });
});
