import { test, expect } from '@playwright/test';

test('should load the app and display Add Task button', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForSelector('button:has-text("Add Task")', { timeout: 10000 });
  const addButton = page.getByRole('button', { name: /add task/i });
  await expect(addButton).toBeVisible();
});
