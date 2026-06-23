import { test, expect } from '@playwright/test'

test.describe('API endpoints', () => {
  test('GET /api/stats returns demo stats', async ({ request }) => {
    const res = await request.get('/api/stats')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('activeNodes')
    expect(body).toHaveProperty('agents')
    expect(body).toHaveProperty('impressions')
  })

  test('GET /api/feed returns posts array', async ({ request }) => {
    const res = await request.get('/api/feed')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('posts')
    expect(Array.isArray(body.posts)).toBe(true)
  })

  test('POST /api/feed without auth returns 401', async ({ request }) => {
    const res = await request.post('/api/feed', { data: {} })
    expect(res.status()).toBe(401)
  })
})
