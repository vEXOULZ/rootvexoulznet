import { ArchiveClient, NO_CATEGORY, boxArt, normalizeVod, vodThumbnail, watchPath, type RawChapter, type RawVod } from '@vexoulz/vods-core'
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
  /** Live: Twitch's stream preview. Offline: the same thumbnail vods.vexoul.net shows for the VOD. */
  image?: string
  /** Where the card itself leads: Twitch when live, the VOD on vods.vexoul.net otherwise. */
  href: string
  /** Live only. */
  startedAt?: Date
  /** Offline only: when the VOD was streamed and how long it ran (seconds). */
  date?: Date
  duration?: number
}

type GameRef = Pick<RawChapter, 'name' | 'image' | 'imageTemplate'>

/** `/v1/status`: the live stream, and its VOD row (live) or the latest VOD (offline). */
interface Status {
  live: boolean
  stream: { id: string; started_at: string | null; title?: string | null; game?: GameRef | null } | null
  vod: RawVod | null
}

const archive = new ArchiveClient({ apiBase: ARCHIVE_API })

/** Distinct games in play order (a game played twice shows once, where it was last played). */
function gamesOf(chapters: readonly GameRef[]): CardGame[] {
  const games = new Map<string, CardGame>()
  for (const c of chapters) {
    const name = c.name?.trim() || NO_CATEGORY
    games.delete(name)
    games.set(name, { name, image: boxArt(c.imageTemplate ?? c.image) ?? undefined })
  }
  return [...games.values()]
}

/** The live stream, or the latest VOD when offline: one `/v1/status` call. The Twitch preview changes every
 *  refresh, so its URL carries the current minute. */
export async function fetchStreamCard(signal?: AbortSignal): Promise<StreamCard> {
  const { live, stream, vod } = await archive.get<Status>('/v1/status', signal)

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
  const shared = normalizeVod(vod)
  return {
    live: false,
    title: vod.title ?? undefined,
    games: gamesOf(vod.chapters ?? []),
    // The thumbnail, link and length come from vods-core, so they match what vods.vexoul.net shows for this VOD.
    image: vodThumbnail(shared) ?? undefined,
    href: `${VODS_URL}${watchPath(shared)}`,
    date: new Date(vod.createdAt),
    duration: shared.duration || undefined,
  }
}
