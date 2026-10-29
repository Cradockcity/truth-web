import { expect, test } from '@playwright/test'

// Creates a real 20-minute hold in the test database, on the furthest open session to stay out of
// the way. Payment itself isn't automated: it runs on Paystack's hosted checkout.
test('reserve a session and reach the payment step', async ({ page }) => {
  await page.goto('/experiences/e1000000-0000-0000-0000-000000000001')

  const book = page.getByRole('region', { name: 'Book this experience' })
  await book.getByRole('button', { name: /Show all \d+ dates/ }).click()

  const sheet = page.getByRole('dialog', { name: 'All available dates' })
  await sheet.locator('label').last().click()
  await expect(sheet).toBeHidden()

  await expect(book.getByText('Service fee')).toBeVisible()
  await book.getByRole('link', { name: 'Reserve' }).click()

  await expect(page.getByRole('heading', { name: 'Confirm your booking' })).toBeVisible()
  await page.getByRole('button', { name: /Reserve for R/ }).click()
  await expect(page.getByText('Enter your full name')).toBeVisible()

  await page.getByLabel('Full name').fill('Playwright Test')
  await page.getByLabel('Email').fill('playwright@example.com')
  await page.getByRole('button', { name: /Reserve for R/ }).click()

  await expect(page).toHaveURL(/\/bookings\/[0-9a-f-]+\?token=/)
  await expect(page.getByRole('heading', { name: 'Your seats are held' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Pay R/ })).toBeVisible()
})

test('a booking link without its token stays private', async ({ page }) => {
  await page.goto('/bookings/c07a5651-304f-4f0a-b1cb-85913fdabceb')
  await expect(page.getByRole('heading', { name: "We couldn't find that page" })).toBeVisible()
})

test('My bookings asks signed-out visitors to sign in', async ({ page }) => {
  await page.goto('/account/bookings')
  await expect(page).toHaveURL(
    /\/signin\?next=%2Faccount%2Fbookings|\/signin\?next=\/account\/bookings/,
  )
  await expect(page.getByRole('button', { name: 'Email me a sign-in link' })).toBeVisible()
})
