import { siteInfo, type SiteId } from '@vexoulz/ui'
import { TWITCH_CHANNEL, TWITCH_URL } from './config'

export interface SiteLink {
  name: string
  handle: string
  href: string
  /** A vexoulz.net site: its handle takes that site's accent. */
  site?: SiteId
}

export interface LinkGroup {
  title: string
  links: SiteLink[]
}

const vods = siteInfo('vods')
const shop = siteInfo('shop')

export const TWITCH_LINK: SiteLink = { name: 'Twitch', handle: `ttv/${TWITCH_CHANNEL}`, href: TWITCH_URL }
export const VODS_LINK: SiteLink = { name: 'Vods', handle: vods.host, href: vods.href, site: 'vods' }

export const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Stream',
    links: [
      TWITCH_LINK,
      VODS_LINK,
      { name: 'TikTok', handle: 'tiktok/@vexoulz', href: 'https://tiktok.com/@vexoulz' },
      { name: 'YouTube', handle: 'yt/@vexoulz', href: 'https://youtube.com/@vEXOULZ' },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Discord Server', handle: 'vEXcord', href: 'https://discord.vexoulz.net' },
      {
        name: 'Offline Chat',
        handle: `ttv/${TWITCH_CHANNEL}`,
        href: `https://www.twitch.tv/popout/${TWITCH_CHANNEL}/chat?popout=`,
      },
    ],
  },
  {
    title: 'Dev',
    links: [{ name: 'GitHub', handle: 'github/vEXOULZ', href: 'https://github.com/vEXOULZ' }],
  },
  {
    title: 'Socials',
    links: [
      { name: 'Bluesky', handle: '@vexoulz.net', href: 'https://bsky.app/profile/vexoulz.net' },
      { name: 'Steam', handle: 'steam/vexoulz', href: 'https://steamcommunity.com/id/vexoulz/' },
    ],
  },
  {
    title: 'Money',
    links: [
      { name: 'Merch shop', handle: shop.host, href: shop.href },
      { name: 'Throne', handle: 'throne/vexoulz', href: 'https://throne.com/vexoulz' },
    ],
  },
]
