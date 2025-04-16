import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import IsCatalog from '../components/pages/IsCatalog.vue'
import IsProductCategory from '../components/pages/IsProductCategory.vue'
import MyAccount from '../components/pages/MyAccount.vue'
import IsPromotions from '../components/pages/IsPromotions.vue'
import DeliveryAndPayment from '../components/pages/DeliveryAndPayment.vue'

const routes = [
    {
        path: '/',
        component: HomeView
    },
    {
        path: '/catalog',
        component: IsCatalog
    },
    {
        path: '/catalog/:category/:product',
        component: IsProductCategory
    },
    {
        path: '/account/:page',
        component: MyAccount
    },
    {
        path: '/promotions',
        component: IsPromotions
    },
    {
        path: '/delivery-and-payment',
        component: DeliveryAndPayment
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
