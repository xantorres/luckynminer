import { test, expect } from '@playwright/test';

test.describe('Game Initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the game title and initial UI', async ({ page }) => {
    
    // Check if the game title is displayed (updated name)
    await expect(page.locator('h1')).toContainText('LuckyNMiner');
    
    // Check if the balance section is displayed in header
    await expect(page.locator('text=BALANCE')).toBeVisible();
    
    // Check if the max prize section is displayed
    await expect(page.locator('text=MAX PRIZE')).toBeVisible();
    
    // Check if coin tiers are displayed in footer (with proper decimal format)
    await expect(page.locator('text=75.00')).toBeVisible();
    
    // Check if the start game button is displayed
    await expect(page.locator('button:has-text("START GAME")')).toBeVisible();
    
    // Check if the empty board message is displayed
    await expect(page.locator('text=Click "Start Game" to begin')).toBeVisible();
  });

  test('should start a new game when start button is clicked', async ({ page }) => {
    
    // Click the start game button
    await page.click('button:has-text("START GAME")');
    
    // Wait for the game to load
    await page.waitForTimeout(1000);
    
    // Check if the game board is displayed with 9 cells
    const cells = page.locator('button[aria-label*="Cell at row"]');
    await expect(cells).toHaveCount(9);
    
    // Check if the balance shows 0 initially (be more specific to header area)
    await expect(page.locator('[class*="balanceValues"] span[class*="value"]').first()).toContainText('0.00');
    await expect(page.locator('[class*="balanceValues"] span[class*="value"]').last()).toContainText('0');
    
    // Check if the cash out button is not visible initially
    const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
    await expect(cashOutButton).not.toBeVisible();
  });

  test('should display loading state during game initialization', async ({ page }) => {
    
    // Click start game and immediately check for loading state
    await page.click('button:has-text("START GAME")');
    
    // The button should be disabled during loading
    await expect(page.locator('button:has-text("Loading...")')).toBeVisible();
    
    // Wait for game to finish loading
    await page.waitForTimeout(1000);
    
    // Loading should be gone
    await expect(page.locator('button:has-text("Loading...")')).not.toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if main elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=BALANCE')).toBeVisible();
    await expect(page.locator('button:has-text("START GAME")')).toBeVisible();
    
    // Check if the layout doesn't overflow
    const container = page.locator('[class*="container"]');
    await expect(container).toBeVisible();
  });
}); 