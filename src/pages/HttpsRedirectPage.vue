<script setup lang="ts">
// /tools/httpsredirect#r=<url-encoded app link>: opens the app link, then closes the tab (see lib/redirect).
import { VxEmptyState, VxSiteShell } from '@vexoulz/ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { redirectTarget } from '@/lib/redirect'

const target = redirectTarget(location.hash)
const opened = ref(false)

// The browser asks once per app whether this site may open its links. The first visit for an app stays
// open so that prompt can be answered (and "always allow" ticked); later visits close themselves.
const seenKey = target ? `httpsredirect:seen:${new URL(target).protocol}` : ''
let firstVisit = true
try {
  firstVisit = !localStorage.getItem(seenKey)
  localStorage.setItem(seenKey, '1')
} catch {
  // No storage (private window, blocked site data): never close, so the prompt can always be answered.
}
const stays = firstVisit

// Browsers only let a page close a tab that has nothing to go back to,
// which is the case for a link opened in a new tab. Otherwise the message stays.
function done() {
  opened.value = true
  window.close()
}
const onBlur = () => setTimeout(done, 300)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (!target) return
  if (stays) {
    location.href = target
    return
  }
  window.addEventListener('blur', onBlur, { once: true })
  timer = setTimeout(done, 5000)
  location.href = target
})
onUnmounted(() => {
  window.removeEventListener('blur', onBlur)
  clearTimeout(timer)
})
</script>

<template>
  <VxSiteShell site="root">
    <VxEmptyState v-if="!target" title="Nothing to open">This link doesn't point to an app.</VxEmptyState>
    <VxEmptyState v-else-if="stays" title="Opening…">
      If your browser asks, allow this site to open the app (tick “always allow” so it won't ask again), then
      close this tab. Next time it closes itself.
      <template #actions><a :href="target">Open it again</a></template>
    </VxEmptyState>
    <VxEmptyState v-else :title="opened ? 'Opened' : 'Opening…'">
      {{ opened ? 'You can close this tab.' : 'Handing over to the app.' }}
      <template #actions><a :href="target">Open it again</a></template>
    </VxEmptyState>
  </VxSiteShell>
</template>
