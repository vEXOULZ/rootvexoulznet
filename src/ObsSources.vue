<script setup>
import ItemLink from './components/ItemLink.vue'
import ItemGroup from './components/ItemGroup.vue'
import StandardPage from './components/StandardPage.vue'

import log_twitch from './assets/log_twitch.png'
import log_vods from './assets/log_vods.png'

</script>

<template>

  <StandardPage>
    <div id="grid">
      <div id="intro" class="rainbow-text" style="grid-row: 1 / span 2; grid-column: 1;">
        <img alt="logo" class="logo" src="./assets/vexoulHELP.png" width="213" height="75" />
        <p>Did you nose?</p>
        <p>Vexoulz is not real</p>
        <p>You are not real</p>
        <p>No one is real</p>
        <p>The only thing that's real</p>
        <p>Is my love for yo momma</p>
      </div>

      <ItemGroup title="Homebrew" style="grid-row: 1; grid-column: 2;">
        <ItemLink msg="Countdown"     :img=log_twitch  submsg="lil counter"      link="/obs_sources/countdown"               style="color: rgb(172, 81, 248);"/>
        <ItemLink msg="Vods"       :img=log_vods    submsg="vods.vexoulz.net" link="https://vods.vexoulz.net"                style="color: rgb(218, 0, 60);"/>
      </ItemGroup>

      <ItemGroup title="External" style="grid-row: 1; grid-column: 3;">
        <ItemLink msg="Twitch"     :img=log_twitch  submsg="ttv/vexoulz"      link="https://twitch.tv/vexoulz"               style="color: rgb(172, 81, 248);"/>
        <ItemLink msg="Vods"       :img=log_vods    submsg="vods.vexoulz.net" link="https://vods.vexoulz.net"                style="color: rgb(218, 0, 60);"/>
      </ItemGroup>

    </div>
  </StandardPage>

</template>
