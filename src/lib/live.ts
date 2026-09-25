import { ARCHIVE_API } from './config'

export interface LiveStatus {
  live: boolean
  /** Only when live. */
  title?: string
  game?: string
  startedAt?: Date
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
  title: string | null
  chapters: { name?: string }[] | null
}

async function get<T>(path: string, signal?: AbortSignal): Promise<Page<T>> {
  const res = await fetch(`${ARCHIVE_API}${path}`, { signal, headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return (await res.json()) as Page<T>
}

/** Live state from the archive API: the worker keeps `streams.is_live` current, and the live VOD row has the title. */
export async function fetchLive(signal?: AbortSignal): Promise<LiveStatus> {
  const streams = await get<StreamRow>('/streams?is_live=true&$limit=1', signal)
  const stream = streams.data[0]
  if (!stream) return { live: false }

  const status: LiveStatus = { live: true, startedAt: stream.started_at ? new Date(stream.started_at) : undefined }
  try {
    const vods = await get<VodRow>(`/vods?stream_id=${encodeURIComponent(stream.id)}&$limit=1`, signal)
    const vod = vods.data[0]
    status.title = vod?.title ?? undefined
    status.game = vod?.chapters?.at(-1)?.name
  } catch {
    // The title is a nice-to-have; being live is what matters.
  }
  return status
}
