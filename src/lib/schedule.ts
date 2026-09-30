import { NO_CATEGORY, boxArt } from '@vexoulz/vods-core'
import { TWITCH_ID } from './config'
import type { CardGame } from './live'

/** One upcoming slot from the channel's Twitch schedule. */
export interface ScheduledStream {
  start: Date
  end?: Date
  title?: string
  /** The slot's category; "No category" when none is set, like a VOD chapter without one. */
  game: CardGame
}

/** Twitch's public iCalendar feed of the channel schedule: no auth, and CORS-open. */
const FEED = `https://api.twitch.tv/helix/schedule/icalendar?broadcaster_id=${TWITCH_ID}`

const DAY_MS = 86_400_000
/** How far ahead a recurring slot is expanded. */
const HORIZON_MS = 366 * DAY_MS

interface Prop { params: Record<string, string>; value: string }
type Wall = [number, number, number, number, number, number]

/** The next scheduled stream that hasn't ended yet, or null when the schedule is empty. */
export async function fetchNextStream(signal?: AbortSignal, now = Date.now()): Promise<ScheduledStream | null> {
  const res = await fetch(FEED, { signal })
  if (!res.ok) throw new Error(`schedule: HTTP ${res.status}`)
  return nextStream(await res.text(), now)
}

export function nextStream(ics: string, now = Date.now()): ScheduledStream | null {
  let best: ScheduledStream | null = null
  for (const ev of events(ics)) {
    const s = next(ev, now)
    if (s && (!best || s.start < best.start)) best = s
  }
  return best
}

/** The VEVENTs of a calendar, each as its properties by name. */
function events(ics: string): Map<string, Prop[]>[] {
  const lines = ics.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)
  const out: Map<string, Prop[]>[] = []
  let ev: Map<string, Prop[]> | null = null
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') ev = new Map()
    else if (line === 'END:VEVENT') { if (ev) out.push(ev); ev = null }
    else if (ev) {
      const colon = line.indexOf(':')
      if (colon < 0) continue
      const [name, ...rest] = line.slice(0, colon).split(';')
      const params = Object.fromEntries(rest.map((p) => { const i = p.indexOf('='); return [p.slice(0, i).toUpperCase(), p.slice(i + 1)] }))
      const key = name.toUpperCase()
      ev.set(key, [...(ev.get(key) ?? []), { params, value: line.slice(colon + 1) }])
    }
  }
  return out
}

/** The first occurrence of an event that ends after `now` (weekly recurrences expanded). */
function next(ev: Map<string, Prop[]>, now: number): ScheduledStream | null {
  const dtstart = ev.get('DTSTART')?.[0]
  if (!dtstart) return null
  const tz = zone(dtstart)
  const wall = parseWall(dtstart.value)
  if (!wall) return null
  const first = toUtc(wall, tz)
  const dtend = ev.get('DTEND')?.[0]
  const endWall = dtend && parseWall(dtend.value)
  const length = endWall ? toUtc(endWall, zone(dtend)) - first : 0
  const title = text(ev.get('SUMMARY')?.[0]?.value) || undefined
  const game = category(text(ev.get('CATEGORIES')?.[0]?.value))

  const excluded = new Set(
    (ev.get('EXDATE') ?? []).flatMap((p) => p.value.split(',').map((v) => {
      const w = parseWall(v)
      return w ? toUtc(w, zone(p)) : NaN
    })),
  )
  const rule = Object.fromEntries(
    (ev.get('RRULE')?.[0]?.value ?? '').split(';').filter(Boolean).map((kv) => kv.split('=') as [string, string]),
  )
  const weekly = rule.FREQ === 'WEEKLY'
  const step = 7 * Math.max(1, Number(rule.INTERVAL) || 1)
  const untilWall = rule.UNTIL ? parseWall(rule.UNTIL) : null
  const until = untilWall ? toUtc(untilWall, rule.UNTIL.endsWith('Z') ? 'UTC' : tz) : Infinity
  const count = Number(rule.COUNT) || Infinity

  for (let i = 0; i < (weekly ? count : 1); i++) {
    // Step the wall-clock date, so the slot keeps its local time across DST changes.
    const d = new Date(Date.UTC(wall[0], wall[1] - 1, wall[2] + i * step))
    const start = toUtc([d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), wall[3], wall[4], wall[5]], tz)
    if (start > until || start > now + HORIZON_MS) break
    if (start + length <= now || excluded.has(start)) continue
    return { start: new Date(start), end: length ? new Date(start + length) : undefined, title, game }
  }
  return null
}

/** An iCalendar TEXT value, unescaped. */
function text(v?: string): string {
  return (v ?? '').replace(/\\([,;\\])/g, '$1').replace(/\\n/gi, ' ').trim()
}

/** The feed names the category but carries no art; Twitch serves box art by name too (an unknown name gets its
 *  generic "404" poster). */
function category(name: string): CardGame {
  if (!name) return { name: NO_CATEGORY }
  return { name, image: boxArt(`https://static-cdn.jtvnw.net/ttv-boxart/${encodeURIComponent(name)}-{width}x{height}.jpg`) ?? undefined }
}

/** The time zone a DTSTART/DTEND is in: its TZID (Twitch writes "/Area/City"), UTC for a trailing Z. */
function zone(p: Prop): string | undefined {
  if (p.value.endsWith('Z')) return 'UTC'
  return p.params.TZID?.replace(/^\/+/, '') || undefined
}

function parseWall(v: string): Wall | null {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/.exec(v)
  return m ? [+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)] : null
}

/** A wall-clock time in `tz` as epoch ms (no zone: the viewer's own). */
function toUtc(w: Wall, tz?: string): number {
  if (!tz) return new Date(w[0], w[1] - 1, w[2], w[3], w[4], w[5]).getTime()
  const guess = Date.UTC(w[0], w[1] - 1, w[2], w[3], w[4], w[5])
  const first = guess - offset(guess, tz)
  return guess - offset(first, tz)
}

/** How far `tz` is ahead of UTC at instant `t`, in ms (0 for a zone the browser doesn't know). */
function offset(t: number, tz: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    }).formatToParts(new Date(t))
    const n = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    return Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second')) - Math.floor(t / 1000) * 1000
  } catch {
    return 0
  }
}
