import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BranchingTree from '../views/BranchingTree.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BranchingTree',
    component: BranchingTree
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
