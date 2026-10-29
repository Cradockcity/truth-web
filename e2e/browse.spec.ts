import { expect, test } from '@playwright/test'

test('filter by category and guests through the URL', async ({ page }) => {
  await page.goto('/experiences')
  const results = page.locator('main article')
  await expect(results.first()).toBeVisible()
  const total = await results.count()

  await page.getByRole('link', { name: 'Adventure', exact: true }).click()
  await expect(page).toHaveURL(/category=Adventure/)
  await expect(page.getByRole('link', { name: 'Adventure', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  const adventure = await results.count()
  expect(adventure).toBeGreaterThan(0)
  expect(adventure).toBeLessThan(total)

  await page.goto('/experiences?category=Adventure&guests=10')
  await expect(page.getByText(/for 10 guests/)).toBeVisible()
  expect(await results.count()).toBeLessThanOrEqual(adventure)
})

test('open an experience, save it, and find it under Saved', async ({ page }) => {
  await page.goto('/experiences')
  const firstTitle = page.locator('main article h3 a').first()
  const title = (await firstTitle.textContent())?.trim() ?? ''
  await firstTitle.click()

  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)

  await page.getByRole('button', { name: `Save ${title}` }).click()
  await expect(page.getByRole('button', { name: `Remove ${title} from saved` })).toBeVisible()

  await page.goto('/saved')
  await expect(page.getByRole('heading', { level: 3, name: title })).toBeVisible()

  await page.getByRole('button', { name: `Remove ${title} from saved` }).click()
  await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()
})

test('creator pages list their picks', async ({ page }) => {
  await page.goto('/creators/sarah-johnson')
  await expect(page.getByRole('heading', { level: 1, name: 'Sarah Johnson' })).toBeVisible()
  await expect(page.locator('main article').first()).toBeVisible()
})

test('unknown experiences show the not found page', async ({ page }) => {
  await page.goto('/experiences/not-a-real-id')
  await expect(page.getByRole('heading', { name: "We couldn't find that page" })).toBeVisible()
})

test('sitemap lists experiences and creators', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('/experiences/')
  expect(sitemap).toContain('/creators/sarah-johnson')
})
