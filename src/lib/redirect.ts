// /tools/httpsredirect#r=<url-encoded target>: an https link that hands off to an app's own link scheme
// (obsidian://, steam://, …), for places that only open https links.
// The target rides in the fragment, which browsers never send to the server.

/** Schemes a page can already link to, or that could run or show something in the browser itself. */
const BLOCKED = new Set(['http:', 'https:', 'javascript:', 'data:', 'vbscript:', 'file:', 'blob:', 'about:', 'ftp:', 'ws:', 'wss:'])

/** The app link in a `#r=…` fragment, or null when it's missing or isn't an app link. */
export function redirectTarget(hash: string): string | null {
  const r = new URLSearchParams(hash.replace(/^#/, '')).get('r')
  if (!r) return null
  let url: URL
  try {
    url = new URL(r)
  } catch {
    return null
  }
  return BLOCKED.has(url.protocol) ? null : r
}
