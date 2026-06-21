import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('loads and displays the page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('navigates to studio', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /studio/i }).first().click()
    await expect(page).toHaveURL(/\/studio/)
  })

  test('navigates to gallery', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /gallery/i }).first().click()
    await expect(page).toHaveURL(/\/gallery/)
  })
})
