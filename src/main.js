import './assets/main.css'

import { createApp } from 'vue'

import { createWebHistory, createRouter } from 'vue-router'

import AppRoute from './App.vue'
import NotFoundRoute from './NotFound.vue'
import LandingRoute from './Landing.vue'
import ObsSourcesRoute from './ObsSources.vue'
import ObsSourceCountdownRoute from './obs_sources/Countdown.vue'


const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundRoute },
  { path: '/', component: LandingRoute },
  { path: '/obs_sources', component: ObsSourcesRoute },
  { path: '/obs_sources/countdown', component: ObsSourceCountdownRoute },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(AppRoute)
    .use(router)
    .mount('#app')
