<script setup lang="ts">
import { VxAccountMenu, VxPlaceholder, VxSiteShell } from '@vexoulz/ui'
import LinkList from '@/components/LinkList.vue'
import LiveCard from '@/components/LiveCard.vue'
import { LINK_GROUPS } from '@/lib/links'
</script>

<template>
  <VxSiteShell site="root">
    <template #account><VxAccountMenu disabled /></template>
    <div class="root">
      <section class="intro">
        <VxPlaceholder label="logo 213×75" :w="213" :h="75" />
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
.intro h1 { font-size: 34px; margin-top: 8px; }
.intro p { margin: 0; line-height: 1.6; }
/* A poem: one line per span, never re-wrapped into a paragraph. */
.poem span { display: block; }
@container vx-site (max-width: 700px) {
  .root { grid-template-columns: 1fr; gap: 28px; }
  .intro h1 { font-size: 28px; }
}
</style>
