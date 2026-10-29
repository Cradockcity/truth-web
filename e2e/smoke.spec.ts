import { expect, test } from '@playwright/test'

test('home page shows the hero and featured experiences', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Unforgettable experiences/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Unforgettable experiences' }),
  ).toBeVisible()
  const featured = page.getByRole('region', { name: 'Featured experiences' })
  await expect(featured.getByRole('article')).toHaveCount(4)
})
