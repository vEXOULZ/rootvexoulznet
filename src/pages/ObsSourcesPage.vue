<script setup lang="ts">
import { VxAccountMenu, VxSiteShell } from '@vexoulz/ui'
import LinkList from '@/components/LinkList.vue'
import type { LinkGroup } from '@/lib/links'

const groups: LinkGroup[] = [
  {
    title: 'Homebrew',
    links: [{ name: 'Countdown', handle: '?h=&m=&s=&text=', href: '/obs_sources/countdown' }],
  },
  {
    title: 'External',
    links: [
      { name: 'Twitch', handle: 'ttv/vexoulz', href: 'https://twitch.tv/vexoulz' },
      { name: 'Vods', handle: 'vods.vexoulz.net', href: 'https://vods.vexoulz.net', site: 'vods' },
    ],
  },
]
</script>

<template>
  <VxSiteShell site="root">
    <template #account><VxAccountMenu disabled /></template>
    <h1 class="vx-display title">OBS sources</h1>
    <p class="vx-muted lead">Browser sources for the stream. Add one to OBS as a browser source with a transparent background.</p>
    <LinkList :groups="groups" />
  </VxSiteShell>
</template>

<style scoped>
.title { font-size: 28px; }
.lead { margin: 8px 0 28px; }
</style>
