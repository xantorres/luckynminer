import { test, expect } from '@playwright/test';

test.describe('Cash Out Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow cashing out with winnings', async ({ page }) => {
    // Start a game
    await page.click('button:has-text("START GAME")');
    await page.waitForTimeout(1000);
    
    // Try to find winning cells and cash out
    const cells = page.locator('button[aria-label*="Cell at row"]');
    const cellCount = await cells.count();
    
    for (let i = 0; i < cellCount; i++) {
      const cell = cells.nth(i);
      await cell.click();
      await page.waitForTimeout(300);
      
      const cellContent = await cell.textContent();
      if (cellContent === '🍀') {
        // Found a win, check if cash out button appears
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        await expect(cashOutButton).toBeVisible();
        
        // Click cash out
        await cashOutButton.click();
        
        // Check if cash out modal appears
        await expect(page.locator('text=Cash Out?')).toBeVisible();
        
        // Confirm cash out
        await page.click('button:has-text("Cash Out")');
        
        // Wait for celebration and completion
        await page.waitForTimeout(3000);
        
        // Check if restart option appears
        await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
        
        break;
      } else if (cellContent === '💣') {
        // Hit mine, game should end with restart option
        await expect(page.locator('button:has-text("RESTART")')).toBeVisible();
        break;
      }
    }
  });

  test('should not show cash out button with zero winnings', async ({ page }) => {
    // Start a game
    await page.click('button:has-text("START GAME")');
    await page.waitForTimeout(1000);
    
    // Cash out button should not be visible initially (no winnings yet)
    const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
    await expect(cashOutButton).not.toBeVisible();
    
    // Balance should show 0 initially (be specific to header area)
    await expect(page.locator('[class*="balanceValues"] span[class*="value"]').first()).toContainText('0.00');
  });

  test('should preserve winnings when cashing out', async ({ page }) => {
    // Start a game
    await page.click('button:has-text("START GAME")');
    await page.waitForTimeout(1000);
    
    // Try to find winning cells
    const cells = page.locator('button[aria-label*="Cell at row"]');
    const cellCount = await cells.count();
    
    for (let i = 0; i < cellCount; i++) {
      const cell = cells.nth(i);
      await cell.click();
      await page.waitForTimeout(300);
      
      const cellContent = await cell.textContent();
      if (cellContent === '🍀') {
        // Found a win, check if balance increased (look for non-zero values in header)
        await page.waitForTimeout(500); // Wait for animation
        const balanceElement = page.locator('[class*="balanceValues"] span[class*="value"]').first();
        const balanceValue = await balanceElement.textContent();
        expect(balanceValue).not.toBe('0.00');
        
        // Cash out should be available
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        if (await cashOutButton.isVisible()) {
          await cashOutButton.click();
          await page.click('button:has-text("Cash Out")');
          await page.waitForTimeout(3000);
          
          // Should be able to play again
          await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
          break;
        }
      } else if (cellContent === '💣') {
        // Hit mine, balance should remain at 0
        await expect(page.locator('[class*="balanceValues"] span[class*="value"]').first()).toContainText('0.00');
        break;
      }
    }
  });

  test('should enable continuous play after cash out', async ({ page }) => {
    // Start a game  
    await page.click('button:has-text("START GAME")');
    await page.waitForTimeout(1000);
    
    // Try to find a winning cell and cash out
    const cells = page.locator('button[aria-label*="Cell at row"]');
    const cellCount = await cells.count();
    
    for (let i = 0; i < cellCount; i++) {
      const cell = cells.nth(i);
      await cell.click();
      await page.waitForTimeout(300);
      
      const cellContent = await cell.textContent();
      if (cellContent === '🍀') {
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        if (await cashOutButton.isVisible()) {
          await cashOutButton.click();
          await page.click('button:has-text("Cash Out")');
          await page.waitForTimeout(3000);
          
          // Click "Play Again" to continue playing
          await page.click('button:has-text("Play Again")');
          await page.waitForTimeout(1000);
          
          // Should be in a new game with fresh board
          const newCells = page.locator('button[aria-label*="Cell at row"]');
          await expect(newCells).toHaveCount(9);
          break;
        }
      } else if (cellContent === '💣') {
        // Hit mine, can still restart
        await page.click('button:has-text("RESTART")');
        await page.waitForTimeout(1000);
        const newCells = page.locator('button[aria-label*="Cell at row"]');
        await expect(newCells).toHaveCount(9);
        break;
      }
    }
  });
}); 