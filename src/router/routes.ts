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
        meta: {
            requiresAuth: true
        },
        component: () => import('../views/UserProfile.vue'),
    },
    {
        path: '/add-post',
        name: 'Add Post',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/AddPost.vue')
    },
    {
        path: '/user/:usermail',
        name: 'User',
        meta: {
            requiresAuth: true
        },
        component: () => import('../views/ViewProfile.vue')
    },
    {
        path: '/edit',
        name: 'Edit',
        meta: {
            requiresAuth: true
        },
        component: () => import('../views/ProfileEdit.vue')
    },
    {
        path: "/friends",
        name: "Friends",
        meta: {
            requiresAuth: true
        },
        component: () => import('../views/FriendsPage.vue')
    },
    {
        path: "/friends/:email",
        name: "FriendsWithProps",
        component: () => import('../views/ViewFriendsPage.vue')
    }
]


export default routes