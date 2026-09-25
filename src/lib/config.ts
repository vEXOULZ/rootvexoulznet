/** Public archive API (the same one vods.vexoulz.net reads). Override with VITE_ARCHIVE_API. */
export const ARCHIVE_API = (import.meta.env.VITE_ARCHIVE_API ?? 'https://vods.vexoulz.net/backend').replace(/\/$/, '')

export const TWITCH_URL = 'https://twitch.tv/vexoulz'
export const VODS_URL = 'https://vods.vexoulz.net'
