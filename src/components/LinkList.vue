<script setup lang="ts">
import { VxPlaceholder } from '@vexoulz/ui'
import type { LinkGroup } from '@/lib/links'

defineProps<{ groups: LinkGroup[] }>()
</script>

<template>
  <section class="groups">
    <div v-for="g in groups" :key="g.title" class="group">
      <h2 class="vx-eyebrow">{{ g.title }}</h2>
      <a v-for="l in g.links" :key="l.name" :href="l.href" rel="noopener" class="link">
        <span class="icon vx-ring"><VxPlaceholder :label="l.name.slice(0, 2).toLowerCase()" :w="40" :h="40" /></span>
        <span class="text">
          <span class="name">{{ l.name }}</span>
          <span class="handle" :class="l.site && `vx-accent-${l.site}`">{{ l.handle }}</span>
        </span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 24px; }
.group { display: flex; flex-direction: column; gap: 6px; }
.group h2 { margin: 0 0 4px; }
.link { display: flex; align-items: center; gap: 12px; padding: 6px 8px; margin: 0 -8px; border-radius: var(--vx-radius); color: inherit; text-decoration: none; }
.link:hover, .link:focus-visible { background: var(--vx-hover); }
.icon { border-radius: var(--vx-radius-sm); display: block; flex: none; }
.text { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.3; }
.name { color: var(--vx-ink); font-weight: 600; }
.handle { font-size: 12px; color: var(--vx-muted); font-family: var(--vx-font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.handle.vx-accent-vods { color: var(--vx-accent-vods); }
.handle.vx-accent-dtp { color: var(--vx-accent-dtp); }
.arrow { color: var(--vx-muted); opacity: 0; transition: opacity 0.15s; font-family: var(--vx-font-mono); }
.link:hover .arrow, .link:focus-visible .arrow { opacity: 1; }
@container vx-site (max-width: 700px) {
  .groups { grid-template-columns: 1fr; }
  /* No hover on touch: always show the arrow so every row reads as a link. */
  .arrow { opacity: 1; }
}
</style>
