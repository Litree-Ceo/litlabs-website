import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Replicates the core logic from src/lib/rate-limiter.ts
function rateLimit({ count = 0, limit = 100, windowSec = 60 }) {
  const remaining = Math.max(0, limit - count)
  const resetTime = windowSec
  return {
    success: count <= limit,
    remaining,
    resetTime,
  }
}

describe('rateLimiter core logic', () => {
  it('allows requests within limit', () => {
    const result = rateLimit({ count: 5, limit: 100 })
    assert.ok(result.success)
    assert.equal(result.remaining, 95)
  })

  it('blocks requests over limit', () => {
    const result = rateLimit({ count: 101, limit: 100 })
    assert.ok(!result.success)
    assert.equal(result.remaining, 0)
  })

  it('allows exactly at limit', () => {
    const result = rateLimit({ count: 100, limit: 100 })
    assert.ok(result.success)
    assert.equal(result.remaining, 0)
  })

  it('returns non-negative remaining', () => {
    const result = rateLimit({ count: 200, limit: 100 })
    assert.ok(!result.success)
    assert.equal(result.remaining, 0)
  })

  it('returns reset time in seconds', () => {
    const result = rateLimit({ count: 0, limit: 10, windowSec: 30 })
    assert.equal(result.resetTime, 30)
  })
})
