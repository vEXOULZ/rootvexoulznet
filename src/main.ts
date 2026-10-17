import '@vex/ui/fonts.css'
import '@vex/ui/style.css'

import { VxBuild } from '@vex/ui'
import { createAccount } from '@vex/ui/account'
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
    // Hands an https link over to an app link (obsidian://, …); see lib/redirect.
    { path: '/tools/httpsredirect', component: () => import('./pages/HttpsRedirectPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./pages/NotFoundPage.vue') },
  ],
})

// The shared *.vexoul.net sign-in: auth.vexoul.net, or VITE_AUTH_BASE when set (empty turns sign-in off).
createApp(App).use(router).use(VxBuild, { commit: __COMMIT__ }).use(createAccount()).mount('#app')
