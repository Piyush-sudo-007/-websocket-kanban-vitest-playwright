import { test, expect } from '@playwright/test';

test("User can add a task and see it on the board", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForSelector('button:has-text("Add Task")', { timeout: 10000 });
  await page.click('button:has-text("Add Task")');

  await page.waitForSelector('text=Real-time Kanban Board', { timeout: 10000 });
  await expect(page.getByText("Real-time Kanban Board")).toBeVisible();
});
