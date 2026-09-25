import type { SiteId } from '@vexoulz/ui'

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

export const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Stream',
    links: [
      { name: 'Twitch', handle: 'ttv/vexoulz', href: 'https://twitch.tv/vexoulz' },
      { name: 'Vods', handle: 'vods.vexoulz.net', href: 'https://vods.vexoulz.net', site: 'vods' },
      { name: 'TikTok', handle: 'tiktok/@vexoulz', href: 'https://tiktok.com/@vexoulz' },
      { name: 'YouTube', handle: 'yt/@vexoulz', href: 'https://youtube.com/@vEXOULZ' },
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
      { name: 'Discord', handle: 'vEXcord server', href: 'https://discord.vexoulz.net' },
      { name: 'Steam', handle: 'steam/vexoulz', href: 'https://steamcommunity.com/id/vexoulz/' },
    ],
  },
  {
    title: 'Money',
    links: [
      { name: 'Merch shop', handle: 'shop.vexoulz.net', href: 'https://shop.vexoulz.net' },
      { name: 'Throne', handle: 'throne/vexoulz', href: 'https://throne.com/vexoulz' },
    ],
  },
]
