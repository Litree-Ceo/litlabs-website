import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

function scorePassword(pw) {
  let score = 0
  if (pw.length >= 8) score += 1
  if (pw.length >= 12) score += 1
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1
  if (/\d/.test(pw)) score += 1
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1

  if (score <= 1) return { score, label: 'Weak' }
  if (score === 2) return { score, label: 'Fair' }
  if (score === 3) return { score, label: 'Good' }
  if (score === 4) return { score, label: 'Strong' }
  return { score: 5, label: 'Very Strong' }
}

describe('PasswordStrength scoring', () => {
  it('returns Weak for score 0 (short, no variety)', () => {
    const r = scorePassword('ab')
    assert.equal(r.score, 0)
    assert.equal(r.label, 'Weak')
  })

  it('returns Weak for score 1 (length >= 8 only)', () => {
    const r = scorePassword('aaaaaaaa')
    assert.equal(r.score, 1)
    assert.equal(r.label, 'Weak')
  })

  it('returns Fair for score 2 (length + number)', () => {
    const r = scorePassword('12345678')
    assert.equal(r.score, 2)
    assert.equal(r.label, 'Fair')
  })

  it('returns Good for score 3 (length + mixed case + number)', () => {
    const r = scorePassword('Abcdefgh1')
    assert.equal(r.score, 3)
    assert.equal(r.label, 'Good')
  })

  it('returns Strong for score 4 (all except length >= 12)', () => {
    const r = scorePassword('Abcdefgh1!')
    assert.equal(r.score, 4)
    assert.equal(r.label, 'Strong')
  })

  it('returns Very Strong for score 5 (all criteria met)', () => {
    const r = scorePassword('Abcdefgh123!')
    assert.equal(r.score, 5)
    assert.equal(r.label, 'Very Strong')
  })

  it('handles empty string', () => {
    const r = scorePassword('')
    assert.equal(r.score, 0)
    assert.equal(r.label, 'Weak')
  })

  it('handles special characters only', () => {
    const r = scorePassword('!@#$%^&*')
    assert.equal(r.score, 2) // length + special
    assert.equal(r.label, 'Fair')
  })

  it('handles numbers only', () => {
    const r = scorePassword('12345678')
    assert.equal(r.score, 2) // length + number
    assert.equal(r.label, 'Fair')
  })

  it('treats mixed case correctly', () => {
    const lowerOnly = scorePassword('abcdefgh1!')
    const mixed = scorePassword('Abcdefgh1!')
    assert.ok(mixed.score > lowerOnly.score)
  })

  it('scores length >= 12 correctly', () => {
    const r = scorePassword('abcdefgh1234')
    assert.equal(r.score, 3) // length8 + length12 + number
    assert.equal(r.label, 'Good')
  })
})
