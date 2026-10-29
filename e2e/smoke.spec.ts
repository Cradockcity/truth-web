import { expect, test } from '@playwright/test'

test('home page loads with site metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Unforgettable experiences/)
  await expect(page.getByRole('heading', { level: 1, name: 'TRUTH' })).toBeVisible()
})
