import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home';
import ShopProducts from '@/components/Shop/Products';
import Product from '@/components/Shop/Product';
import Cart from '@/components/Shop/Cart';
import Checkout from '@/components/Shop/Checkout';

import Login from '@/components/Admin/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/Admin/Products';
import Orders from '@/components/Admin/Orders';
import Coupons from '@/components/Admin/Coupons';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'ShopProducts',
          component: ShopProducts
        },
        {
          path: 'product/:productId',
          name: 'Product',
          component: Product
        },
        {
          path: '/cart',
          name: 'Cart',
          component: Cart
        },
        {
          path: '/checkout/:orderId',
          name: 'Checkout',
          component: Checkout
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
