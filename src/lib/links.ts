import { siteInfo, type AccentSiteId } from '@vexoulz/ui'
import { TWITCH_CHANNEL, TWITCH_URL } from './config'

export interface SiteLink {
  name: string
  handle: string
  href: string
  /** An entry in the site list with an accent (the shop included): its handle takes that accent. */
  site?: AccentSiteId
  /** Its icon in public/links/, without the .svg; a placeholder without one. */
  icon?: string
}

export interface LinkGroup {
  title: string
  links: SiteLink[]
}

const vods = siteInfo('vods')
const shop = siteInfo('shop')
const status = siteInfo('status')
const dtp = siteInfo('dtp')

export const TWITCH_LINK: SiteLink = { name: 'Twitch', icon: 'twitch', handle: `ttv/${TWITCH_CHANNEL}`, href: TWITCH_URL }
export const VODS_LINK: SiteLink = { name: 'Vods', icon: 'vexoul-vods', handle: vods.host, href: vods.href, site: 'vods' }
export const STATUS_LINK: SiteLink = { name: 'Status', icon: 'vexoul-status', handle: status.host, href: status.href, site: 'status' }
export const DTP_LINK: SiteLink = { name: 'DoomTP Bot', icon: 'vexoul-dtp', handle: dtp.host, href: dtp.href, site: 'dtp' }
export const SHOP_LINK: SiteLink = { name: 'Shop', icon: 'vexoul-shop', handle: shop.host, href: shop.href, site: 'shop' }

export const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Stream',
    links: [
      TWITCH_LINK,
      VODS_LINK,
      { name: 'TikTok', icon: 'tiktok', handle: 'tiktok/@vexoulz', href: 'https://tiktok.com/@vexoulz' },
      { name: 'YouTube', icon: 'youtube', handle: 'yt/@vexoulz', href: 'https://youtube.com/@vEXOULZ' },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Discord Server', icon: 'discord', handle: 'vEXcord', href: 'https://discord.vexoul.net' },
      {
        name: 'Offline Chat', icon: 'offline-chat',
        handle: `ttv/${TWITCH_CHANNEL}`,
        href: `https://www.twitch.tv/popout/${TWITCH_CHANNEL}/chat?popout=`,
      },
    ],
  },
  {
    title: 'Dev',
    links: [
      { name: 'GitHub', icon: 'github', handle: 'github/vEXOULZ', href: 'https://github.com/vEXOULZ' },
      STATUS_LINK,
      DTP_LINK,
    ],
  },
  {
    title: 'Socials',
    links: [
      { name: 'Bluesky', icon: 'bluesky', handle: '@luna.vexoul.net', href: 'https://bsky.app/profile/luna.vexoul.net' },
      { name: 'Twitter', icon: 'twitter', handle: '@vexoulsad', href: 'https://x.com/vexoulsad' },
      { name: 'Steam', icon: 'steam', handle: 'steam/vexoulz', href: 'https://steamcommunity.com/id/vexoulz/' },
    ],
  },
  {
    title: 'Money',
    links: [
      SHOP_LINK,
      { name: 'Throne', icon: 'throne', handle: 'throne/vexoulz', href: 'https://throne.com/vexoulz' },
    ],
  },
]
