import { describe, expect, it } from 'vitest'
import { redirectTarget } from '../src/lib/redirect'

const enc = (target: string) => `#r=${encodeURIComponent(target)}`

describe('redirectTarget', () => {
  it('passes an app link through untouched', () => {
    const note = 'obsidian://open?vault=Life&file=04-Resources%2FJob%20search%20resources'
    expect(redirectTarget(enc(note))).toBe(note)
  })

  it('is null without a target', () => {
    expect(redirectTarget('')).toBeNull()
    expect(redirectTarget('#x=1')).toBeNull()
    expect(redirectTarget('#r=not%20a%20url')).toBeNull()
  })

  it('refuses web links, so it is not an open redirect', () => {
    expect(redirectTarget(enc('https://example.com'))).toBeNull()
    expect(redirectTarget(enc('HTTP://example.com'))).toBeNull()
  })

  it('refuses links that would run or show something in the browser', () => {
    for (const t of ['javascript:alert(1)', 'JavaScript:alert(1)', 'data:text/html,hi', 'vbscript:x', 'file:///etc/passwd', 'about:blank']) {
      expect(redirectTarget(enc(t))).toBeNull()
    }
  })
})
