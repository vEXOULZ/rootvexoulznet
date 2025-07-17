<script setup>

import { setupBackground } from '../stars_bg.js'

setupBackground()

document.addEventListener('DOMContentLoaded', () => {

    document.getElementsByTagName('body')[0].classList.add("default")
  
})

</script>

<template>

  <slot></slot>

  <footer>
    Made by: vEXOULZ @2025
  </footer>
</template>
