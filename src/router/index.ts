import { createRouter, createWebHistory } from 'vue-router'
import TheHomeView from '@/views/TheHomeView.vue'
import TheGraph1Page from '@/components/TheGraph1Page.vue'
import TheGraph2Page from '@/components/TheGraph2Page.vue'
import TheGraph3Page from '@/components/TheGraph3Page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheHomeView
    },
    {
      path: '/graph1',
      name: 'graph1',
      component: TheGraph1Page
    },
    {
      path: '/graph2',
      name: 'graph2',
      component: TheGraph2Page
    },
    {
      path: '/graph3',
      name: 'graph3',
      component: TheGraph3Page
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
