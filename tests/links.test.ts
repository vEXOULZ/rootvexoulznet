import { describe, expect, it } from 'vitest'
import { KEEKIVODS_LINK, LINK_GROUPS, TWITCH_LINK, VODS_LINK } from '../src/lib/links'

describe('LINK_GROUPS', () => {
  const links = LINK_GROUPS.flatMap((g) => g.links)

  it('links only to https', () => {
    for (const l of links) expect(new URL(l.href).protocol, l.name).toBe('https:')
  })

  it('has no empty group and no duplicate names within a group', () => {
    for (const g of LINK_GROUPS) {
      expect(g.links.length, g.title).toBeGreaterThan(0)
      expect(new Set(g.links.map((l) => l.name)).size, g.title).toBe(g.links.length)
    }
  })

  it('leads with Twitch and the VODs site', () => {
    expect(LINK_GROUPS[0].links.slice(0, 2)).toEqual([TWITCH_LINK, VODS_LINK])
    expect(VODS_LINK.site).toBe('vods')
  })

  it('ends with the friends, keekivods among them', () => {
    const last = LINK_GROUPS[LINK_GROUPS.length - 1]
    expect(last.title).toBe('Friends')
    expect(last.links).toContain(KEEKIVODS_LINK)
  })
})
