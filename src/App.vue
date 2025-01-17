<script setup>
import SocialLink from './components/SocialLink.vue'
</script>

<template>

    <intro>
      <img alt="logo" class="logo" src="./assets/vexoulHELP.png" width="213" height="75" />
      <p>Did you nose?</p>
      <p>Vexoulz is not real</p>
      <p>You are not real</p>
      <p>No one is real</p>
      <p>The only thing that's real</p>
      <p>Is my love for yo momma</p>
    </intro>


  <main>
      <SocialLink msg="Bluesky"    img="src/assets/log_bluesky.png" submsg="@vexoulz.net"     link="https://bsky.app/profile/vexoulz.net" style="color: rgb(16, 129, 246);"/>
      <SocialLink msg="Twitch"     img="src/assets/log_twitch.png"  submsg="ttv/vexoulz"      link="https://twitch.tv/vexoulz"            style="color: rgb(172, 81, 248);"/>
      <SocialLink msg="Vods"       img="src/assets/log_vods.png"    submsg="vods.vexoulz.net" link="https://vods.vexoulz.net"             style="color: rgb(224, 179, 157);"/>
      <SocialLink msg="Merch shop" img="src/assets/log_shop.png"    submsg="shop.vexoulz.net" link="https:/shop.vexoulz.net"              style="color: rgb(200, 200, 200);"/>
  </main>

  <footer>
    Made by vEXOULZ @ 2025 with pain. HELP
  </footer>

</template>

<style scoped>
body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
} 

intro {
  line-height: 1.5;
  min-height: 50px;
}

footer {
  min-height: 50px;
  place-items: center;
  padding-left: calc(var(--section-gap));
}

@media (min-width: 128px) {
  intro {
    display: grid;
    place-items: center;
    padding-right: calc(var(--section-gap) / 4);
  }

  intro .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
