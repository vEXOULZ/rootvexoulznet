<script setup lang="ts">
// Stream status: a LIVE card linking to Twitch, or an "Offline" line pointing at the vods.
// Hidden until the first answer, and stays hidden if the archive API can't be reached.
import { VxChip, VxPlaceholder, VxPosters, VxStatusDot, formatDuration } from '@vexoulz/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { TWITCH_URL, VODS_URL } from '@/lib/config'
import { fetchLive, type LiveStatus } from '@/lib/live'

const REFRESH_MS = 60_000

const status = ref<LiveStatus | null>(null)
const now = ref(Date.now())
let ctrl: AbortController | undefined
let poll: ReturnType<typeof setInterval> | undefined
let tick: ReturnType<typeof setInterval> | undefined

async function refresh() {
  ctrl?.abort()
  ctrl = new AbortController()
  try {
    status.value = await fetchLive(ctrl.signal)
  } catch (e) {
    if ((e as Error).name !== 'AbortError') status.value = null
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

const uptime = computed(() => {
  const at = status.value?.startedAt
  return at ? formatDuration((now.value - at.getTime()) / 1000) : null
})
const meta = computed(() => [status.value?.game, uptime.value].filter(Boolean).join(' · '))
</script>

<template>
  <a v-if="status?.live" :href="TWITCH_URL" rel="noopener" class="live vx-panel">
    <div class="thumb">
      <VxPlaceholder label="live preview" ratio="16 / 9" />
      <VxChip live class="badge">LIVE</VxChip>
    </div>
    <div class="info">
      <div class="title">{{ status.title ?? 'Live on Twitch' }}</div>
      <div v-if="meta" class="meta">
        <VxPosters v-if="status.game" :games="[status.game]" mode="stack" :size="22" />
        <span class="vx-mono vx-muted vx-tabular">{{ meta }}</span>
      </div>
    </div>
  </a>
  <div v-else-if="status" class="offline vx-panel">
    <VxStatusDot status="off" />
    <span><b>Offline</b> <a :href="VODS_URL" class="vx-mono vx-muted">· watch past streams →</a></span>
  </div>
</template>

<style scoped>
.offline { display: flex; align-items: center; gap: 10px; padding: 8px 14px; font-size: 13px; }
.offline a { text-decoration: none; }
.offline a:hover { color: var(--vx-ink); }
.live { display: flex; flex-direction: column; overflow: hidden; width: 100%; max-width: 360px; color: inherit; text-decoration: none; }
.live:hover { border-color: var(--vx-bad); }
.thumb { position: relative; }
.thumb :deep(.vx-ph) { border: none; border-radius: 0; }
.badge { position: absolute; left: 8px; top: 8px; }
.info { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; text-align: left; }
.title { font-weight: 600; line-height: 1.3; color: var(--vx-ink); }
.meta { display: flex; align-items: center; gap: 10px; font-size: 12px; }
</style>
