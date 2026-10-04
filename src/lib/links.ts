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
const status = siteInfo('status')
const dtp = siteInfo('dtp')

export const TWITCH_LINK: SiteLink = { name: 'Twitch', handle: `ttv/${TWITCH_CHANNEL}`, href: TWITCH_URL }
export const VODS_LINK: SiteLink = { name: 'Vods', handle: vods.host, href: vods.href, site: 'vods' }
export const STATUS_LINK: SiteLink = { name: 'Status', handle: status.host, href: status.href, site: 'status' }
export const DTP_LINK: SiteLink = { name: 'DoomTP Bot', handle: dtp.host, href: dtp.href, site: 'dtp' }
export const SHOP_LINK: SiteLink = { name: 'Shop', handle: shop.host, href: shop.href, site: 'shop' }

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
    links: [
      { name: 'GitHub', handle: 'github/vEXOULZ', href: 'https://github.com/vEXOULZ' },
      STATUS_LINK,
      DTP_LINK,
    ],
  },
  {
    title: 'Socials',
    links: [
      { name: 'Bluesky', handle: '@vexoulz.net', href: 'https://bsky.app/profile/vexoulz.net' },
      { name: 'Twitter', handle: '@vexoulsad', href: 'https://x.com/vexoulsad' },
      { name: 'Steam', handle: 'steam/vexoulz', href: 'https://steamcommunity.com/id/vexoulz/' },
    ],
  },
  {
    title: 'Money',
    links: [
      SHOP_LINK,
      { name: 'Throne', handle: 'throne/vexoulz', href: 'https://throne.com/vexoulz' },
    ],
  },
]
