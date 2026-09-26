import '@vexoulz/ui/fonts.css'
import '@vexoulz/ui/style.css'
import './styles.css'

import { VxBuild } from '@vexoulz/ui'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./pages/LandingPage.vue') },
    { path: '/obs_sources', component: () => import('./pages/ObsSourcesPage.vue') },
    // Browser source for OBS: transparent, no site chrome or starfield.
    { path: '/obs_sources/countdown', component: () => import('./pages/CountdownPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./pages/NotFoundPage.vue') },
  ],
})

createApp(App).use(router).use(VxBuild, { commit: __COMMIT__ }).mount('#app')
