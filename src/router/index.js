import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import IsCatalog from '../components/pages/IsCatalog.vue'

const routes = [
    {
        path: '/',
        component: HomeView
    },
    {
        path: '/catalog',
        component: IsCatalog
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
