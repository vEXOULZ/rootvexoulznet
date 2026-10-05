import { siteInfo } from '@vexoulz/ui'

/** Public archive API (the same one vods.vexoul.net reads). Override with VITE_ARCHIVE_API. */
export const ARCHIVE_API = (import.meta.env.VITE_ARCHIVE_API ?? 'https://vods.vexoul.net/backend').replace(/\/$/, '')

export const TWITCH_CHANNEL = 'vexoulz'
/** The channel's numeric Twitch id (the schedule feed takes the id, not the login). */
export const TWITCH_ID = '38656648'
export const TWITCH_URL = `https://twitch.tv/${TWITCH_CHANNEL}`
export const SCHEDULE_URL = `${TWITCH_URL}/schedule`
export const VODS_URL = siteInfo('vods').href
