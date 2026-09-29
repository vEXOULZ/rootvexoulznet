<script setup lang="ts">
import { VxSiteShell } from '@vexoulz/ui'
import AccountMenu from '@/components/AccountMenu.vue'
import LinkList from '@/components/LinkList.vue'
import { TWITCH_LINK, VODS_LINK, type LinkGroup } from '@/lib/links'

const groups: LinkGroup[] = [
  {
    title: 'Homebrew',
    links: [{ name: 'Countdown', handle: '?h=&m=&s=&text=', href: '/obs_sources/countdown' }],
  },
  {
    title: 'External',
    links: [TWITCH_LINK, VODS_LINK],
  },
]
</script>

<template>
  <VxSiteShell site="root">
    <template #account><AccountMenu /></template>
    <h1 class="vx-display title">OBS sources</h1>
    <p class="vx-muted lead">Browser sources for the stream. Add one to OBS as a browser source with a transparent background.</p>
    <LinkList :groups="groups" />
  </VxSiteShell>
</template>

<style scoped>
.title { font-size: 28px; }
.lead { margin: 8px 0 28px; }
</style>
