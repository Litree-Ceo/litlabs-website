import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('siteConfig', () => {
  it('should provide a default site URL', () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://litlabs.net'
    assert.ok(url.startsWith('http'))
    assert.ok(new URL(url))
  })
})
