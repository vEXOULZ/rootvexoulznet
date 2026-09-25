<script setup lang="ts">
// OBS browser source: /obs_sources/countdown?h=0&m=5&s=0&text=starting%20soon
// Transparent page, no site chrome. At zero it flashes a bell and loops a quiet alarm.
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import alarmUrl from '@/assets/alarm.mp3'

const route = useRoute()
const num = (v: unknown) => {
  const n = Number(Array.isArray(v) ? v[0] : v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
const text = String(route.query.text ?? '')
const total = 3600 * num(route.query.h) + 60 * num(route.query.m) + num(route.query.s)
const end = Date.now() + total * 1000

const shown = ref('0:00:00')
const pad = (n: number) => String(n).padStart(2, '0')

let timer: ReturnType<typeof setInterval> | undefined
let flip = false
let audio: HTMLAudioElement | undefined

function run() {
  const left = end - Date.now()
  if (left > 0) {
    const s = Math.ceil(left / 1000)
    shown.value = `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
    return
  }
  flip = !flip
  shown.value = flip ? '⠀🔔' : '🔔⠀'
  if (!audio) {
    audio = new Audio(alarmUrl)
    audio.volume = 0.1
    audio.loop = true
    // OBS allows autoplay; a normal browser tab may block it until the page is clicked.
    audio.play().catch(() => {})
  }
}

// The site styles paint the page black; a browser source needs it see-through.
const saved = { html: '', body: '' }
onMounted(() => {
  saved.html = document.documentElement.style.cssText
  saved.body = document.body.style.cssText
  document.documentElement.style.background = 'transparent'
  document.body.style.background = 'transparent'
  document.body.style.overflow = 'hidden'
  run()
  timer = setInterval(run, 500)
})
onUnmounted(() => {
  clearInterval(timer)
  audio?.pause()
  document.documentElement.style.cssText = saved.html
  document.body.style.cssText = saved.body
})
</script>

<template>
  <div class="countdown">
    <p class="line">{{ shown }}</p>
    <p class="line">{{ text || ' ' }}</p>
  </div>
</template>

<style scoped>
.line {
  margin: 0;
  padding: 0;
  text-align: center;
  color: white;
  font-family: monospace;
  text-shadow: 1px 1px 1px black;
}
</style>
