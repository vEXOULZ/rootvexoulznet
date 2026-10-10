<script setup lang="ts">
// Stream card: the live stream (links to Twitch) or, when offline, the latest VOD (links to it on vods.vexoul.net),
// in the same layout. Both have a "watch past streams" button. Hidden until the first answer, and while the archive
// API can't be reached. Polls only while the tab is visible (usePoll), and the clocks tick once a second (useNow).
// Offline, it also shows the next slot on the Twitch schedule (left out if there's none or Twitch can't be reached).
import { VxButton, VxChip, VxNoThumbnail, VxPosters, VxStatusDot, formatDuration } from '@vexoulz/ui'
import { useNow, usePoll } from '@vexoulz/ui/utils'
import { computed, ref, watch } from 'vue'
import { SCHEDULE_URL, VODS_URL } from '@/lib/config'
import { fetchStreamCard } from '@/lib/live'
import { fetchNextStream } from '@/lib/schedule'

const REFRESH_MS = 60_000
/** Twitch's feed says it changes at most every few hours; a new slot shows within this. */
const SCHEDULE_MS = 15 * 60_000

const stream = usePoll(fetchStreamCard, REFRESH_MS)
const card = computed(() => (stream.error.value ? null : stream.data.value))
// The schedule is only asked for while offline: it loads when the card goes offline, then every SCHEDULE_MS.
const offline = computed(() => card.value?.live === false)
const schedule = usePoll(
  (signal) => (offline.value ? fetchNextStream(signal) : Promise.resolve(null)),
  () => (offline.value ? SCHEDULE_MS : 0),
  { source: offline, resetOnSource: false },
)
const scheduled = computed(() => (schedule.error.value ? null : schedule.data.value))
const now = useNow(1000)

const broken = ref(false)
watch(() => card.value?.image, () => (broken.value = false))

const current = computed(() => card.value?.games.at(-1)?.name)
const meta = computed(() => {
  const c = card.value
  if (!c) return ''
  if (c.live) return [current.value, c.startedAt && formatDuration((now.value - c.startedAt.getTime()) / 1000)]
    .filter(Boolean)
    .join(' · ')
  const date = c.date?.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  return [date, c.duration && formatDuration(c.duration)].filter(Boolean).join(' · ')
})
// The next slot, until it ends. Local time, with the year only when it isn't this year's.
const next = computed(() => {
  const s = scheduled.value
  if (!s || card.value?.live || (s.end ?? s.start).getTime() <= now.value) return null
  const sameYear = s.start.getFullYear() === new Date(now.value).getFullYear()
  const when = s.start.toLocaleString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short', year: sameYear ? undefined : 'numeric', hour: '2-digit', minute: '2-digit',
  })
  return { title: s.title, game: s.game, when, rel: relative(s.start.getTime() - now.value), iso: s.start.toISOString() }
})

function relative(ms: number): string {
  if (ms <= 0) return 'now'
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const min = Math.round(ms / 60_000)
  if (min < 60) return rtf.format(min, 'minute')
  const h = Math.round(min / 60)
  if (h < 36) return rtf.format(h, 'hour')
  return rtf.format(Math.round(h / 24), 'day')
}

const title = computed(() => card.value?.title ?? (card.value?.live ? 'Live on Twitch' : 'Latest stream'))
</script>

<template>
  <article v-if="card" class="card vx-panel" :class="{ 'is-live': card.live }">
    <a :href="card.href" rel="noopener" class="main" :aria-label="`${card.live ? 'Live now' : 'Latest VOD'}: ${title}`">
      <div class="thumb">
        <img v-if="card.image && !broken" :src="card.image" alt="" decoding="async" @error="broken = true" />
        <VxNoThumbnail v-else :label="card.live ? 'live preview' : 'no thumbnail yet'" />
        <VxChip v-if="card.live" live class="badge">LIVE</VxChip>
        <span v-else class="badge offline vx-mono"><VxStatusDot status="off" /> Offline · latest VOD</span>
      </div>
      <div class="info">
        <div class="title">{{ title }}</div>
        <div v-if="meta || card.games.length" class="meta">
          <VxPosters v-if="card.games.length" :games="[...card.games].reverse()" mode="stack" :size="22" />
          <span class="vx-mono vx-muted vx-tabular">{{ meta }}</span>
        </div>
      </div>
    </a>
    <a v-if="next" :href="SCHEDULE_URL" rel="noopener" class="next" :aria-label="`Next stream ${next.when}${next.title ? ': ' + next.title : ''} (${next.game.name})`">
      <VxPosters :games="[next.game]" mode="stack" :size="45" />
      <span class="next-text">
        <span class="next-label vx-mono">Next stream</span>
        <span class="next-when vx-tabular"><time :datetime="next.iso">{{ next.when }}</time> <span class="vx-muted">· {{ next.rel }}</span></span>
        <span v-if="next.title" class="next-title">{{ next.title }}</span>
        <span class="next-game vx-mono vx-muted">{{ next.game.name }}</span>
      </span>
    </a>
    <div class="actions">
      <VxButton :href="VODS_URL" size="sm" block>Watch past streams →</VxButton>
    </div>
  </article>
</template>

<style scoped>
.card { display: flex; flex-direction: column; overflow: hidden; width: 100%; max-width: 360px; }
.card:has(.main:hover) { border-color: var(--vx-accent); }
.card.is-live:has(.main:hover) { border-color: var(--vx-bad); }
.main { display: flex; flex-direction: column; color: inherit; text-decoration: none; }
.main:hover .title, .main:focus-visible .title { color: var(--vx-accent); }
.thumb { position: relative; aspect-ratio: 16 / 9; background: var(--vx-surface); }
.thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; left: 8px; top: 8px; }
.offline {
  display: inline-flex; align-items: center; gap: 6px; padding: 1px 8px; font-size: 11px; color: #fff;
  border-radius: var(--vx-radius-sm); background: rgb(0 0 0 / 0.75);
}
.info { padding: 10px 12px 4px; display: flex; flex-direction: column; gap: 6px; text-align: left; }
.title { font-weight: 600; line-height: 1.3; color: var(--vx-ink); overflow-wrap: anywhere; }
.meta { display: flex; align-items: center; gap: 10px; font-size: 12px; }
.next {
  display: flex; align-items: flex-start; gap: 10px; margin: 6px 12px 0; padding: 8px 10px; text-align: left;
  color: inherit; text-decoration: none; font-size: 12px;
  border: 1px solid var(--vx-line); border-radius: var(--vx-radius-sm); background: var(--vx-surface);
}
.next:hover, .next:focus-visible { border-color: var(--vx-accent); }
.next-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.next-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vx-accent); }
.next-when { color: var(--vx-ink); }
.next-title { color: var(--vx-muted); overflow-wrap: anywhere; }
.next-game { font-size: 11px; overflow-wrap: anywhere; }
.actions { display: flex; padding: 8px 12px 12px; }
</style>
