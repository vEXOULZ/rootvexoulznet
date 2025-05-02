<script setup>
import ItemLink from './components/ItemLink.vue'
import ItemGroup from './components/ItemGroup.vue'
import log_bluesky from './assets/log_bluesky.png'
import log_twitch from './assets/log_twitch.png'
import log_vods from './assets/log_vods.png'
import log_shop from './assets/log_shop.png'
import log_discord from './assets/log_discord.png'
import log_github from './assets/log_github.png'

import noisejs from 'noisejs/index.js'

console.log(noisejs.Noise)

var noise = new noisejs.Noise()
noise.seed(Math.random());

function freshDot(){

  var top = 100 * Math.random();
  var left = 100 * Math.random();

  var chance = (noise.perlin2(left/10, top/10) + 0.5) / 1.5;
  console.log(top)
  console.log(left)
  console.log(chance)

  if (Math.random() > chance) return;

  console.log("OK")


  var obj = document.createElement("div");
  obj.classList.add("star");
  obj.style.top = top + 'vh';
  obj.style.left = left + 'vw';

  var sequence = Math.random();
  var sizeMult = 1;

  if (sequence < 0.0000006) {
    obj.classList.add("sO");
    sizeMult = 6.6;
  } else if (sequence < 0.0024) {
    obj.classList.add("sB");
    sizeMult = 1.8;
  } else if (sequence < 0.0122) {
    obj.classList.add("sA");
    sizeMult = 1.4;
  } else if (sequence < 0.06) {
    obj.classList.add("sF");
    sizeMult = 1.15;
  } else if (sequence < 0.152) {
    obj.classList.add("sG");
    sizeMult = 0.96;
  } else if (sequence < 0.24) {
    obj.classList.add("sK");
    sizeMult = 0.7;
  } else {
    obj.classList.add("sM");
    sizeMult = 0.5;
  }

  obj.classList.add("twinkle");
  obj.style.animationDuration = (Math.random() * 5 + 1).toString() + "s";

  var size = Math.floor(2 * sizeMult * Math.random()) + 1;
  obj.style.height =  size + 'px';
  obj.style.width = size + 'px';
  
  document.body.appendChild(obj);
}

function generateDots() {
  var size = 400;
  for(var i = 0 ; i < size; i++ ){
    new freshDot();
  }
}

if (document.getElementsByClassName("star").length == 0) {
  generateDots();
}
</script>

<template>

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


    <ItemGroup title="Socials" style="grid-row: 1; grid-column: 2;">
      <ItemLink msg="Bluesky"    :img=log_bluesky submsg="@vexoulz.net"     link="https://bsky.app/profile/vexoulz.net" style="color: rgb(16, 129, 246);"/>
      <ItemLink msg="Discord"    :img=log_discord submsg="vEXcord server"   link="https://discord.gg/QxWfs9e"           style="color: rgb(86, 98, 246);"/>
    </ItemGroup>

    <ItemGroup title="Stream" style="grid-row: 1; grid-column: 3;">
      <ItemLink msg="Twitch"     :img=log_twitch  submsg="ttv/vexoulz"      link="https://twitch.tv/vexoulz"            style="color: rgb(172, 81, 248);"/>
      <ItemLink msg="Vods"       :img=log_vods    submsg="vods.vexoulz.net" link="https://vods.vexoulz.net"             style="color: rgb(218, 0, 60);"/>
    </ItemGroup>

    <ItemGroup title="Money" style="grid-row: 2; grid-column: 2;">
      <ItemLink msg="Merch shop" :img=log_shop    submsg="shop.vexoulz.net" link="https://shop.vexoulz.net"             style="color: rgb(169, 129, 97);"/>
    </ItemGroup>

    <ItemGroup title="Dev" style="grid-row: 2; grid-column: 3;">
      <ItemLink msg="Github"     :img=log_github  submsg="github/vEXOULZ"   link="https://github.com/vEXOULZ"           style="color: rgb(200, 200, 200);"/>
    </ItemGroup>

  </div>

  <footer>
    Made by: vEXOULZ @2025
  </footer>

</template>

<style scoped>

.logo {
  margin-bottom: 20px;
}

#intro {
  /* position: absolute; */
  text-align: center;
  margin: 5px;
  line-height: 2;
}

</style>
