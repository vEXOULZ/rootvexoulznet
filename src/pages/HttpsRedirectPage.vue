<script setup lang="ts">
// /tools/httpsredirect#r=<url-encoded app link>: opens the app link, then closes the tab (see lib/redirect).
import { VxEmptyState, VxSiteShell } from '@vexoulz/ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { redirectTarget } from '@/lib/redirect'

const target = redirectTarget(location.hash)
const opened = ref(false)

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
    <VxEmptyState v-else :title="opened ? 'Opened' : 'Opening…'">
      {{ opened ? 'You can close this tab.' : 'Handing over to the app.' }}
      <template #actions><a :href="target">Open it again</a></template>
    </VxEmptyState>
  </VxSiteShell>
</template>
