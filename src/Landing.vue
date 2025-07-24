<script setup>
import ItemLink from './components/ItemLink.vue'
import ItemGroup from './components/ItemGroup.vue'
import StandardPage from './components/StandardPage.vue'

import log_bluesky from './assets/log_bluesky.png'
import log_twitch from './assets/log_twitch.png'
import log_vods from './assets/log_vods.png'
import log_shop from './assets/log_shop.png'
import log_discord from './assets/log_discord.png'
import log_github from './assets/log_github.png'
// import log_dtp from './assets/log_dtp.png'
// import log_obs from './assets/log_obs.png'
import log_throne from './assets/log_throne.png'
import helpimg from './assets/vexoulHELP.png'
import log_steam from './assets/log_steam.png'
import log_tiktok from './assets/log_tiktok.png'
import log_youtube from './assets/log_youtube.png'

</script>

<template>

  <StandardPage>
    <div id="grid" style="grid-template-columns: 1fr 1fr 1fr;">

        <div id="intro" class="rainbow-text" style="grid-row: 1 / span 3; grid-column: 1; align-self: center;">
        <b>
          <a href="https://vexoulz.net" rel="noopener">
            <img alt="logo" class="logo" :src=helpimg width="213" height="75" style="margin:0"/>
            <h2>HOME</h2>
          </a>
        </b>
        <p>Did you nose?</p>
        <p>Vexoulz is not real</p>
        <p>You are not real</p>
        <p>No one is real</p>
        <p>The only thing that's real</p>
        <p>Is my love for yo momma</p>
        </div>

        <ItemGroup title="Stream" style="grid-row: 1; grid-column: 2;">
          <ItemLink msg="Twitch"     :img=log_twitch  submsg="ttv/vexoulz"      link="https://twitch.tv/vexoulz"             style="color: rgb(172, 81, 248);"/>
          <ItemLink msg="Vods"       :img=log_vods    submsg="vods.vexoulz.net" link="https://vods.vexoulz.net"              style="color: rgb(222, 114, 25);"/>
          <ItemLink msg="Tiktok"     :img=log_tiktok  submsg="tiktok/@vexoulz"  link="https://tiktok.com/@vexoulz"           style="color: rgb(100, 200, 200);"/>
          <ItemLink msg="Youtube"    :img=log_youtube submsg="yt/@vexoulz"      link="https://youtube.com/@vEXOULZ"          style="color: rgb(200, 0, 0);"/>
          <!-- <ItemLink msg="OBS Sources":img=log_obs     submsg="./obs_sources"    link="/obs_sources"                          style="color: rgb(200, 200, 200);"/> -->
        </ItemGroup>

        <ItemGroup title="Dev" style="grid-row: 2; grid-column: 2;">
          <ItemLink msg="Github"     :img=log_github  submsg="github/vEXOULZ"   link="https://github.com/vEXOULZ"            style="color: rgb(120, 120, 120);"/>
          <!-- <ItemLink msg="DTP bot"    :img=log_dtp     submsg="dtp.vexoulz.net"  link="https://dtp.vexoulz.net"               style="color: rgb(182, 163, 108);"/> -->
        </ItemGroup>

        <div style="grid-row: 1 / span 2; grid-column: 3;">
          <ItemGroup title="Socials">
            <ItemLink msg="Bluesky"    :img=log_bluesky submsg="@vexoulz.net"     link="https://bsky.app/profile/vexoulz.net"  style="color: rgb(16, 129, 246);"/>
            <ItemLink msg="Discord"    :img=log_discord submsg="vEXcord server"   link="https://discord.gg/vexoulz"            style="color: rgb(86, 98, 246);"/>
            <ItemLink msg="Steam"      :img=log_steam   submsg="steam/vexoulz"    link="https://steamcommunity.com/id/vexoulz/"style="color: rgb(120, 120, 120);"/>
          </ItemGroup>

          <ItemGroup title="Money">
            <ItemLink msg="Merch shop" :img=log_shop    submsg="shop.vexoulz.net" link="https://shop.vexoulz.net"              style="color: rgb(169, 129, 97);"/>
            <ItemLink msg="Throne"     :img=log_throne  submsg="throne/vexoulz"   link="https://throne.com/vexoulz"            style="color: rgb(108, 102, 195);"/>
          </ItemGroup>
        </div>


    </div>
  </StandardPage>

</template>
