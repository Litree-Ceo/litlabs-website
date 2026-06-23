import { test, expect } from '@playwright/test'

test.describe('Key pages', () => {
  const pages = [
    { path: '/', name: 'home' },
    { path: '/studio', name: 'studio' },
    { path: '/gallery', name: 'gallery' },
    { path: '/marketplace', name: 'marketplace' },
    { path: '/games', name: 'games' },
    { path: '/agents', name: 'agents' },
    { path: '/sign-in', name: 'sign-in' },
    { path: '/sign-up', name: 'sign-up' },
  ]

  for (const { path, name } of pages) {
    test(`loads ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')))
    })
  }

  test('home page has navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav, header, [role="navigation"]').first()).toBeVisible()
  })
})
