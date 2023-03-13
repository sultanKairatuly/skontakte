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
        name: 'Home',
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
    {
        path: '/add-post',
        name: 'Add Post',
        component: () => import('../components/AddPost.vue')
    },
    {
        path: '/user/:usermail',
        name: 'User',
        component: () => import('../views/ViewProfile.vue')
    },
    {
        path: '/edit',
        name: 'Edit',
        component: () => import('../views/ProfileEdit.vue')
    }
]


export default routes