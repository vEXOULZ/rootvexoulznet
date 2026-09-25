import { ARCHIVE_API, TWITCH_CHANNEL, TWITCH_URL, VODS_URL } from './config'

export interface CardGame {
  name: string
  image?: string
}

/** What the stream card shows: the live stream, or (offline) the latest archived VOD, in the same layout. */
export interface StreamCard {
  live: boolean
  title?: string
  /** Games in the order played; when live, the last one is being played now. */
  games: CardGame[]
  /** Live: Twitch's stream preview. Offline: the VOD's YouTube thumbnail, when it has been uploaded. */
  image?: string
  /** Where the card itself leads: Twitch when live, the VOD on vods.vexoulz.net otherwise. */
  href: string
  /** Live only. */
  startedAt?: Date
  /** Offline only: when the VOD was streamed and how long it ran (seconds). */
  date?: Date
  duration?: number
}

interface Page<T> {
  data: T[]
}
interface StreamRow {
  id: string
  started_at: string | null
  is_live: boolean | null
}
interface VodRow {
  id: string
  title: string | null
  createdAt: string
  duration: string | null
  thumbnail_url: string | null
  chapters: { name?: string | null; image?: string | null }[] | null
  youtube: { type?: string; part?: number; thumbnail_url?: string | null }[] | null
}

async function get<T>(path: string, signal?: AbortSignal): Promise<Page<T>> {
  const res = await fetch(`${ARCHIVE_API}${path}`, { signal, headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return (await res.json()) as Page<T>
}

/** Twitch box art comes at a tiny baked size (`…-40x53.jpg`); ask for one that stays sharp as a poster. */
const boxArt = (url?: string | null) => (url ? url.replace(/-\d+x\d+(\.\w+)$/, '-144x192$1') : undefined)

/** Distinct games in play order (a game played twice shows once, where it was last played). */
function gamesOf(vod: VodRow | undefined): CardGame[] {
  const games = new Map<string, CardGame>()
  for (const c of vod?.chapters ?? []) {
    const name = c.name?.trim() || 'No category'
    games.delete(name)
    games.set(name, { name, image: boxArt(c.image) })
  }
  return [...games.values()]
}

const seconds = (hms: string | null) => (hms ?? '').split(':').reduce((t, n) => t * 60 + (Number(n) || 0), 0)

/** Same choice as the vods site: VOD uploads, then the live upload, else let it pick. */
function watchUrl(vod: VodRow): string {
  const types = new Set((vod.youtube ?? []).map((u) => u.type))
  const route = types.has('vod') ? 'vods' : types.has('live') ? 'live' : 'youtube'
  return `${VODS_URL}/${route}/${encodeURIComponent(vod.id)}`
}

function thumbnailOf(vod: VodRow): string | undefined {
  const first = [...(vod.youtube ?? [])].sort((a, b) => (a.part ?? 0) - (b.part ?? 0))[0]
  return first?.thumbnail_url ?? vod.thumbnail_url ?? undefined
}

/**
 * The live stream (the worker keeps `streams.is_live` current, and the live VOD row has the title and games), or
 * the latest VOD when offline. The preview image changes every refresh, so it carries the current minute.
 */
export async function fetchStreamCard(signal?: AbortSignal): Promise<StreamCard> {
  const streams = await get<StreamRow>('/streams?is_live=true&$limit=1', signal)
  const stream = streams.data[0]

  if (stream) {
    const card: StreamCard = {
      live: true,
      games: [],
      href: TWITCH_URL,
      image: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${TWITCH_CHANNEL}-640x360.jpg?t=${Math.floor(Date.now() / 60_000)}`,
      startedAt: stream.started_at ? new Date(stream.started_at) : undefined,
    }
    try {
      const vod = (await get<VodRow>(`/vods?stream_id=${encodeURIComponent(stream.id)}&$limit=1`, signal)).data[0]
      card.title = vod?.title ?? undefined
      card.games = gamesOf(vod)
    } catch {
      // Title and games are nice-to-haves; being live is what matters.
    }
    return card
  }

  const vod = (await get<VodRow>('/vods?$sort[createdAt]=-1&$limit=1', signal)).data[0]
  if (!vod) return { live: false, games: [], href: VODS_URL }
  return {
    live: false,
    title: vod.title ?? undefined,
    games: gamesOf(vod),
    image: thumbnailOf(vod),
    href: watchUrl(vod),
    date: new Date(vod.createdAt),
    duration: seconds(vod.duration) || undefined,
  }
}
