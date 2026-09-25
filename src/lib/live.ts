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

interface RawChapter {
  name?: string | null
  image?: string | null
  imageTemplate?: string | null
}
interface VodRow {
  id: string
  title: string | null
  createdAt: string
  duration: string | null
  duration_seconds?: number | null
  thumbnail_url: string | null
  chapters: RawChapter[] | null
  youtube: { type?: string; part?: number; thumbnail_url?: string | null }[] | null
}
/** `/v1/status`: the live stream, and its VOD row (live) or the latest VOD (offline). */
interface Status {
  live: boolean
  stream: { id: string; started_at: string | null; title?: string | null; game?: RawChapter | null } | null
  vod: VodRow | null
}

/** Box art at a size that stays sharp as a poster: from Twitch's `{width}x{height}` template, or by replacing the
 *  small size baked into older URLs (`…-40x53.jpg`). */
function boxArt(c: RawChapter | null | undefined): string | undefined {
  if (c?.imageTemplate) return c.imageTemplate.replace('{width}x{height}', '144x192')
  return c?.image?.replace(/-\d+x\d+(\.\w+)$/, '-144x192$1')
}

/** Distinct games in play order (a game played twice shows once, where it was last played). */
function gamesOf(chapters: readonly RawChapter[]): CardGame[] {
  const games = new Map<string, CardGame>()
  for (const c of chapters) {
    const name = c.name?.trim() || 'No category'
    games.delete(name)
    games.set(name, { name, image: boxArt(c) })
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

/** The live stream, or the latest VOD when offline: one `/v1/status` call. The Twitch preview changes every
 *  refresh, so its URL carries the current minute. */
export async function fetchStreamCard(signal?: AbortSignal): Promise<StreamCard> {
  const res = await fetch(`${ARCHIVE_API}/v1/status`, { signal, headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`/v1/status: HTTP ${res.status}`)
  const { live, stream, vod } = (await res.json()) as Status

  if (live) {
    // The stream's own game goes last: it's the freshest (the VOD's chapters can lag behind a category change).
    const games = gamesOf([...(vod?.chapters ?? []), ...(stream?.game?.name ? [stream.game] : [])])
    return {
      live: true,
      title: stream?.title ?? vod?.title ?? undefined,
      games,
      href: TWITCH_URL,
      image: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${TWITCH_CHANNEL}-640x360.jpg?t=${Math.floor(Date.now() / 60_000)}`,
      startedAt: stream?.started_at ? new Date(stream.started_at) : undefined,
    }
  }

  if (!vod) return { live: false, games: [], href: VODS_URL }
  return {
    live: false,
    title: vod.title ?? undefined,
    games: gamesOf(vod.chapters ?? []),
    image: thumbnailOf(vod),
    href: watchUrl(vod),
    date: new Date(vod.createdAt),
    duration: vod.duration_seconds ?? (seconds(vod.duration) || undefined),
  }
}
