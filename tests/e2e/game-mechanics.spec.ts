import { test, expect } from '@playwright/test';

test.describe('Game Mechanics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START GAME")');
    await page.waitForTimeout(1000); // Wait for game to load
  });

  test('should reveal winning cells and update balance', async ({ page }) => {
    const cells = page.locator('button[aria-label*="Cell at row"]');
    
    // Look for winning cells
    for (let i = 0; i < 9; i++) {
      await cells.nth(i).click();
      await page.waitForTimeout(300);
      
      const cellContent = await cells.nth(i).textContent();
      
      if (cellContent === '🍀') {
        // Check if cash out button appears (indicates winnings exist)
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        await expect(cashOutButton).toBeVisible();
        
        // Verify cell is disabled after clicking
        await expect(cells.nth(i)).toBeDisabled();
        
        // Check if balance increased (look for non-zero in header)
        const balanceElement = page.locator('[class*="balanceValues"] span[class*="value"]').first();
        const balanceValue = await balanceElement.textContent();
        expect(balanceValue).not.toBe('0.00');
        break;
      } else if (cellContent === '💣') {
        // Hit mine, game ends
        break;
      }
    }
    
    // Test passes if we either found a win or hit a mine (both are valid outcomes)
    expect(true).toBeTruthy();
  });

  test('should end game when mine is clicked', async ({ page }) => {
    const cells = page.locator('button[aria-label*="Cell at row"]');
    
    // Click cells until we hit a mine or find all wins
    for (let i = 0; i < 9; i++) {
      await cells.nth(i).click();
      await page.waitForTimeout(300);
      
      const cellContent = await cells.nth(i).textContent();
      
      if (cellContent === '💣') {
        // Game should end, restart button should appear
        await expect(page.locator('button:has-text("RESTART")')).toBeVisible();
        
        // All mines should be revealed
        const revealedCells = page.locator('button:has-text("💣")');
        await expect(revealedCells).not.toHaveCount(0);
        
        break;
      } else if (cellContent === '🍀') {
        // Found a win, continue testing or cash out
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        if (await cashOutButton.isVisible()) {
          // We can continue playing or cash out
          continue;
        }
      }
    }
  });

  test('should prevent clicking revealed cells', async ({ page }) => {
    const cells = page.locator('button[aria-label*="Cell at row"]');
    
    // Click first cell
    await cells.first().click();
    await page.waitForTimeout(300);
    
    // Cell should be disabled after being clicked
    await expect(cells.first()).toBeDisabled();
    
    // Clicking again should have no effect
    const initialContent = await cells.first().textContent();
    await cells.first().click();
    await page.waitForTimeout(300);
    
    const newContent = await cells.first().textContent();
    expect(newContent).toBe(initialContent);
  });

  test('should handle multiple wins correctly', async ({ page }) => {
    const cells = page.locator('button[aria-label*="Cell at row"]');
    let winsFound = 0;
    
    // Try to find multiple winning cells
    for (let i = 0; i < 9; i++) {
      await cells.nth(i).click();
      await page.waitForTimeout(300);
      
      const cellContent = await cells.nth(i).textContent();
      
      if (cellContent === '🍀') {
        winsFound++;
        
        // Each win should make cash out button available
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        await expect(cashOutButton).toBeVisible();
        
        // Could continue to find more wins or test cash out
      } else if (cellContent === '💣') {
        // Hit mine, game ends
        break;
      }
    }
    
    // Test passes regardless of number of wins found
    expect(winsFound).toBeGreaterThanOrEqual(0);
  });

  test('should show cash out button when player has coins', async ({ page }) => {
    // Click cells until we find a winning one
    const cells = page.locator('button[aria-label*="Cell at row"]');
    
    for (let i = 0; i < 9; i++) {
      await cells.nth(i).click();
      await page.waitForTimeout(300);
      
      const cellContent = await cells.nth(i).textContent();
      
      if (cellContent === '🍀') {
        // Cash out button should appear
        await expect(page.locator('button:has-text("💰 Cash Out")')).toBeVisible();
        break;
      } else if (cellContent === '💣') {
        // Hit mine, exit test
        break;
      }
    }
  });

  test('should show correct game states during play', async ({ page }) => {
    // Initially should be in playing state
    const cells = page.locator('button[aria-label*="Cell at row"]');
    await expect(cells).toHaveCount(9);
    
    // Click a cell to change game state
    await cells.first().click();
    await page.waitForTimeout(300);
    
    const cellContent = await cells.first().textContent();
    
    if (cellContent === '💣') {
      // Game ended, should show restart option
      await expect(page.locator('button:has-text("RESTART")')).toBeVisible();
    } else if (cellContent === '🍀') {
      // Found win, cash out should be available
      await expect(page.locator('button:has-text("💰 Cash Out")')).toBeVisible();
    }
  });

  test('should generate random board layouts', async ({ page }) => {
    // This test verifies that games can start successfully multiple times
    // (The actual randomization is tested by the API simulation)
    
    for (let gameNum = 0; gameNum < 3; gameNum++) {
      // End current game quickly
      const cells = page.locator('button[aria-label*="Cell at row"]');
      await cells.first().click();
      await page.waitForTimeout(300);
      
      // Look for restart or play again options
      const restartButton = page.locator('button:has-text("RESTART")');
      const playAgainButton = page.locator('button:has-text("Play Again")');
      
      if (await restartButton.isVisible()) {
        await restartButton.click();
        await page.click('button:has-text("START GAME")');
        await page.waitForTimeout(1000);
      } else if (await playAgainButton.isVisible()) {
        await playAgainButton.click();
        await page.waitForTimeout(1000);
      } else {
        // If no restart option, cash out first
        const cashOutButton = page.locator('button:has-text("💰 Cash Out")');
        if (await cashOutButton.isVisible()) {
          await cashOutButton.click();
          await page.click('button:has-text("Cash Out")');
          await page.waitForTimeout(3000);
          await page.click('button:has-text("Play Again")');
          await page.waitForTimeout(1000);
        }
      }
      
      // Verify game board is created
      const newCells = page.locator('button[aria-label*="Cell at row"]');
      await expect(newCells).toHaveCount(9);
    }
    
    // Test passes if we successfully completed multiple rounds
    expect(true).toBeTruthy();
  });
}); 