import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import IsCatalog from '../components/pages/IsCatalog.vue'
import IsProductCategory from '../components/pages/IsProductCategory.vue'
import MyAccount from '../components/pages/MyAccount.vue'
import IsPromotions from '../components/pages/IsPromotions.vue'
import DeliveryAndPayment from '../components/pages/DeliveryAndPayment.vue'
import AboutUs from '@/components/pages/AboutUs.vue'
import IsContacts from '../components/pages/IsContacts.vue'
import IsBlog from '../components/pages/IsBlog.vue'
import IsBlogPage from '../components/pages/IsBlogPage.vue'
import IsFavourites from '../components/pages/IsFavourites.vue'
import IsCart from '../components/pages/IsCart.vue'
import IsHomeAdmin from '../components/pages/admin/IsHome.vue'
import IsPanelAdmin from '../components/pages/admin/IsPanel.vue'
import IsPanelAdminAED from '../components/pages/admin/products/IsAED.vue'
import IsPanelAdminIEE from '../components/pages/admin/products/IsIEE.vue'
import IsPanelAdminMainOrders from '../components/pages/admin/orders/IsMain.vue'
import IsPanelAdminUsersList from '../components/pages/admin/users/IsList.vue'
import IsPanelAdminUsersMessages from '../components/pages/admin/users/IsMessages.vue'

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
        path: '/catalog/:name',
        component: IsCatalog
    },
    {
        path: '/catalog/product/:product',
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
    },
    {
        path: '/about-us',
        component: AboutUs
    },
    {
        path: '/contacts',
        component: IsContacts
    },
    {
        path: '/blog',
        component: IsBlog
    },
    {
        path: '/blog/:id',
        component: IsBlogPage
    },
    {
        path: '/favorites',
        component: IsFavourites
    },
    {
        path: '/cart',
        component: IsCart
    },
    {
        path: '/search',
        component: IsCatalog
    },
    {
        path: '/admin',
        component: IsHomeAdmin
    },
    {
        path: '/admin/panel',
        component: IsPanelAdmin
    },
    {
        path: '/admin/panel/products/aed',
        component: IsPanelAdminAED
    },
    {
        path: '/admin/panel/products/iee',
        component: IsPanelAdminIEE
    },
    {
        path: '/admin/panel/orders',
        component: IsPanelAdminMainOrders
    },
    {
        path: '/admin/panel/users/list',
        component: IsPanelAdminUsersList
    },
    {
        path: '/admin/panel/users/messages',
        component: IsPanelAdminUsersMessages
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router