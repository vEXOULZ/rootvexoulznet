import { NO_CATEGORY } from '@vexoulz/vods-core'
import { describe, expect, it } from 'vitest'
import { nextStream } from '../src/lib/schedule'

/** A calendar the way Twitch's iCalendar feed writes one: CRLF lines, one VEVENT per slot. */
const ics = (...events: string[][]) =>
  ['BEGIN:VCALENDAR', 'VERSION:2.0', ...events.flatMap((e) => ['BEGIN:VEVENT', ...e, 'END:VEVENT']), 'END:VCALENDAR'].join('\r\n')

const at = (iso: string) => new Date(iso).getTime()

describe('nextStream', () => {
  it('is null for an empty schedule', () => expect(nextStream(ics(), at('2026-10-01T00:00:00Z'))).toBeNull())

  it('reads a one-off slot', () => {
    const s = nextStream(
      ics(['DTSTART:20261005T180000Z', 'DTEND:20261005T210000Z', 'SUMMARY:Doom\, then more Doom', 'CATEGORIES:DOOM']),
      at('2026-10-01T00:00:00Z'),
    )
    expect(s?.start.toISOString()).toBe('2026-10-05T18:00:00.000Z')
    expect(s?.end?.toISOString()).toBe('2026-10-05T21:00:00.000Z')
    expect(s?.title).toBe('Doom, then more Doom')
    expect(s?.game.name).toBe('DOOM')
    expect(s?.game.image).toContain('DOOM')
  })

  it('names a slot without a category like a VOD chapter without one', () => {
    const s = nextStream(ics(['DTSTART:20261005T180000Z']), at('2026-10-01T00:00:00Z'))
    expect(s?.game).toEqual({ name: NO_CATEGORY })
    expect(s?.title).toBeUndefined()
  })

  it('skips a slot that has ended, and keeps one still running', () => {
    const slot = ['DTSTART:20261005T180000Z', 'DTEND:20261005T210000Z']
    expect(nextStream(ics(slot), at('2026-10-05T21:00:00Z'))).toBeNull()
    expect(nextStream(ics(slot), at('2026-10-05T20:00:00Z'))?.start.toISOString()).toBe('2026-10-05T18:00:00.000Z')
  })

  it('picks the earliest of several slots', () => {
    const s = nextStream(
      ics(['DTSTART:20261009T180000Z', 'SUMMARY:later'], ['DTSTART:20261006T180000Z', 'SUMMARY:sooner']),
      at('2026-10-01T00:00:00Z'),
    )
    expect(s?.title).toBe('sooner')
  })

  it('unfolds continuation lines', () => {
    const s = nextStream(ics(['DTSTART:20261005T180000Z', 'SUMMARY:a long', '  title']), at('2026-10-01T00:00:00Z'))
    expect(s?.title).toBe('a long title')
  })

  describe('weekly slots', () => {
    const weekly = (...extra: string[]) => [
      'DTSTART;TZID=/Europe/Lisbon:20260907T200000',
      'DTEND;TZID=/Europe/Lisbon:20260907T230000',
      'RRULE:FREQ=WEEKLY;BYDAY=MO',
      ...extra,
    ]

    it('expands to the next occurrence', () => {
      // Lisbon is UTC+1 in summer: 20:00 local is 19:00Z.
      const s = nextStream(ics(weekly()), at('2026-09-30T00:00:00Z'))
      expect(s?.start.toISOString()).toBe('2026-10-05T19:00:00.000Z')
      expect(s?.end?.toISOString()).toBe('2026-10-05T22:00:00.000Z')
    })

    it('keeps the local time across a DST change', () => {
      // Lisbon falls back to UTC+0 on 25 October 2026: the slot stays at 20:00 local, so 20:00Z.
      expect(nextStream(ics(weekly()), at('2026-10-27T00:00:00Z'))?.start.toISOString()).toBe('2026-11-02T20:00:00.000Z')
    })

    it('skips an excluded date', () => {
      const s = nextStream(ics(weekly('EXDATE;TZID=/Europe/Lisbon:20261005T200000')), at('2026-09-30T00:00:00Z'))
      expect(s?.start.toISOString()).toBe('2026-10-12T19:00:00.000Z')
    })

    it('stops at UNTIL and COUNT', () => {
      const now = at('2026-09-30T00:00:00Z')
      expect(nextStream(ics(weekly().map((l) => l.replace('BYDAY=MO', 'UNTIL=20260930T000000Z'))), now)).toBeNull()
      expect(nextStream(ics(weekly().map((l) => l.replace('BYDAY=MO', 'COUNT=3'))), now)).toBeNull()
      expect(nextStream(ics(weekly().map((l) => l.replace('BYDAY=MO', 'COUNT=5'))), now)).not.toBeNull()
    })

    it('honours INTERVAL', () => {
      const s = nextStream(ics(weekly().map((l) => l.replace('BYDAY=MO', 'INTERVAL=2'))), at('2026-09-30T00:00:00Z'))
      expect(s?.start.toISOString()).toBe('2026-10-05T19:00:00.000Z')
      const t = nextStream(ics(weekly().map((l) => l.replace('BYDAY=MO', 'INTERVAL=2'))), at('2026-10-06T00:00:00Z'))
      expect(t?.start.toISOString()).toBe('2026-10-19T19:00:00.000Z')
    })
  })
})
