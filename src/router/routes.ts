import type { RouteRecordRaw } from 'vue-router'

const routes:   RouteRecordRaw[]  = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/SkSignIn.vue'),
        alias: '/signin'
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/SkSignUp.vue'),
        alias: '/signup'
    },
    {
        path: '/',
        alias: '/home',
        meta: {
            requiresAuth: true
        },
        component: () => import('../views/HomePage.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/UserProfile.vue'),
    },
]


export default routes