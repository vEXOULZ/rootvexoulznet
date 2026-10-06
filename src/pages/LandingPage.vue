<script setup lang="ts">
import { VxSiteShell } from '@vexoulz/ui'
import AccountMenu from '@/components/AccountMenu.vue'
import LinkList from '@/components/LinkList.vue'
import LiveCard from '@/components/LiveCard.vue'
import { LINK_GROUPS } from '@/lib/links'
</script>

<template>
  <VxSiteShell site="root">
    <template #account><AccountMenu /></template>
    <div class="root">
      <section class="intro">
        <img class="logo" src="/logo.svg" alt="vexoul.net" width="240" height="80" />
        <h1 class="vx-display">Did you nose?</h1>
        <p class="poem vx-muted">
          <span>Vexoulz is not real.</span>
          <span>You are not real.</span>
          <span>No one is real.</span>
          <span>The only thing that's real</span>
          <span>is my love for yo momma.</span>
        </p>
        <LiveCard />
      </section>
      <LinkList :groups="LINK_GROUPS" />
    </div>
  </VxSiteShell>
</template>

<style scoped>
.root { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 40px; align-items: start; }
.intro { display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
/* As wide as the stream card below it. */
.logo { width: 100%; height: auto; }
.intro h1 { font-size: 34px; margin-top: 8px; }
.intro p { margin: 0; line-height: 1.6; }
/* A poem: one line per span, never re-wrapped into a paragraph. */
.poem span { display: block; }
@container vx-site (max-width: 700px) {
  .root { grid-template-columns: 1fr; gap: 28px; }
  .intro h1 { font-size: 28px; }
}
</style>
