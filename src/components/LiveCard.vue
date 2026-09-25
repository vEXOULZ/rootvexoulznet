<script setup lang="ts">
// Stream card: the live stream (links to Twitch) or, when offline, the latest VOD (links to it on vods.vexoulz.net),
// in the same layout. Both have a "watch past streams" button. Hidden until the first answer, and stays hidden if
// the archive API can't be reached.
import { VxButton, VxChip, VxPlaceholder, VxPosters, VxStatusDot, formatDuration } from '@vexoulz/ui'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { VODS_URL } from '@/lib/config'
import { fetchStreamCard, type StreamCard } from '@/lib/live'

const REFRESH_MS = 60_000

const card = ref<StreamCard | null>(null)
const now = ref(Date.now())
let ctrl: AbortController | undefined
let poll: ReturnType<typeof setInterval> | undefined
let tick: ReturnType<typeof setInterval> | undefined

async function refresh() {
  ctrl?.abort()
  ctrl = new AbortController()
  try {
    card.value = await fetchStreamCard(ctrl.signal)
  } catch (e) {
    if ((e as Error).name !== 'AbortError') card.value = null
  }
}

onMounted(() => {
  refresh()
  poll = setInterval(refresh, REFRESH_MS)
  tick = setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => {
  ctrl?.abort()
  clearInterval(poll)
  clearInterval(tick)
})

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
const title = computed(() => card.value?.title ?? (card.value?.live ? 'Live on Twitch' : 'Latest stream'))
</script>

<template>
  <article v-if="card" class="card vx-panel" :class="{ 'is-live': card.live }">
    <a :href="card.href" rel="noopener" class="main" :aria-label="`${card.live ? 'Live now' : 'Latest VOD'}: ${title}`">
      <div class="thumb">
        <img v-if="card.image && !broken" :src="card.image" alt="" decoding="async" @error="broken = true" />
        <VxPlaceholder v-else :label="card.live ? 'live preview' : 'no thumbnail yet'" ratio="16 / 9" />
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
    <div class="actions">
      <VxButton :href="VODS_URL" size="sm">Watch past streams →</VxButton>
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
.thumb :deep(.vx-ph) { border: none; border-radius: 0; }
.badge { position: absolute; left: 8px; top: 8px; }
.offline {
  display: inline-flex; align-items: center; gap: 6px; padding: 1px 8px; font-size: 11px; color: #fff;
  border-radius: var(--vx-radius-sm); background: rgb(0 0 0 / 0.75);
}
.info { padding: 10px 12px 4px; display: flex; flex-direction: column; gap: 6px; text-align: left; }
.title { font-weight: 600; line-height: 1.3; color: var(--vx-ink); overflow-wrap: anywhere; }
.meta { display: flex; align-items: center; gap: 10px; font-size: 12px; }
.actions { display: flex; padding: 8px 12px 12px; }
.actions :deep(.vx-btn) { width: 100%; justify-content: center; }
</style>
