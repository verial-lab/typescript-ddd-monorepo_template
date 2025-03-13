import { expect, test } from '@playwright/test';

test.describe('Example UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Component Examples' })).toBeVisible();
  });

  test('counter functionality', async ({ page }) => {
    // Initial state
    await expect(page.getByText('Counter value: 0')).toBeVisible();
    const resetButton = page.getByRole('button', { name: 'Reset Counter' });
    await expect(resetButton).toBeDisabled();

    // Increment counter
    const incrementButton = page.getByRole('button', { name: 'Increment Counter' });
    await incrementButton.click();

    // Wait for loading state
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(incrementButton).toBeDisabled();

    // Wait for counter to update
    await expect(page.getByText('Counter value: 1')).toBeVisible();
    await expect(resetButton).toBeEnabled();

    // Reset counter
    await resetButton.click();
    await expect(page.getByText('Counter value: 0')).toBeVisible();
    await expect(resetButton).toBeDisabled();
  });

  test('card components', async ({ page }) => {
    // Check Button Examples card
    await expect(page.getByRole('heading', { name: 'Button Examples' })).toBeVisible();

    // Check Feature Card
    const featureCard = page.getByRole('heading', { name: 'Feature Card' });
    await expect(featureCard).toBeVisible();
    await expect(page.getByText('This is an example of the Card component')).toBeVisible();
    await expect(page.getByText('It can be used to group related information')).toBeVisible();

    // Check card without title prop
    await expect(page.getByRole('heading', { name: 'Card without title prop' })).toBeVisible();
    await expect(page.getByText('This card demonstrates that the title is optional')).toBeVisible();
  });
});
