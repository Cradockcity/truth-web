import { expect, test } from '@playwright/test'

for (const path of [
  '/admin',
  '/admin/bookings',
  '/admin/bookings/c07a5651-304f-4f0a-b1cb-85913fdabceb',
  '/admin/experiences',
  '/admin/experiences/new',
  '/admin/experiences/e1000000-0000-0000-0000-000000000001',
  '/admin/hosts',
  '/admin/hosts/a1000000-0000-0000-0000-000000000001',
  '/admin/creators',
  '/admin/creators/b1000000-0000-0000-0000-000000000001',
  '/admin/payouts',
  '/admin/payouts/host/a3000000-0000-0000-0000-000000000003',
  '/admin/payment-history',
  '/admin/payment-history/a3000000-0000-0000-0000-000000000003',
  '/admin/payment-history/export',
  '/admin/revenue',
  '/admin/revenue/export?year=2026',
  '/admin/bookings/export?when=all',
]) {
  test(`${path} is locked to signed-out visitors`, async ({ page, request }) => {
    await page.goto(path)
    await expect(page).toHaveURL(/\/admin\/signin/)
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible()

    // Nothing private may be in the response, even before the redirect happens.
    const html = await (await request.get(path)).text()
    expect(html).not.toMatch(/@example\.com|TRUTH-[A-Z0-9]{8}-/)
  })
}

test('admin sign-in asks for email and password first', async ({ page }) => {
  await page.goto('/admin/signin')
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByLabel('Email')).toBeVisible()
})
