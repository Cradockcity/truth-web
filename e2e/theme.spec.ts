import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'light' })

test('a chosen theme overrides the device and survives a reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  await expect(html).not.toHaveAttribute('data-theme')

  await page.getByRole('radio', { name: 'Dark' }).click()
  await expect(html).toHaveAttribute('data-theme', 'dark')

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true')

  await page.getByRole('radio', { name: 'Auto' }).click()
  await expect(html).not.toHaveAttribute('data-theme')
})
