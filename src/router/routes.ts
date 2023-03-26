import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SkSignIn.vue"),
    alias: "/signin",
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/SkSignUp.vue"),
    alias: "/signup",
  },
  {
    path: "/",
    alias: "/profile",
    name: "Profile",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: "/add-post",
    name: "Add Post",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/AddPost.vue"),
  },
  {
    path: "/user/:usermail",
    name: "User",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/ViewProfile.vue"),
  },
  {
    path: "/edit",
    name: "Edit",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/ProfileEdit.vue"),
  },
  {
    path: "/friends",
    name: "Friends",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/FriendsPage.vue"),
  },
  {
    path: "/friends/:email",
    name: "FriendsWithProps",
    component: () => import("../views/ViewFriendsPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("../views/ArticlesPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/my-articles",
    name: "User Articles",
    component: () => import("../views/ArticlesPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "/chats",
    component: () => import("../views/ChatsPage.vue"),
    name: "Chats",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/find-friends",
    component: () => import("../views/FindFriends.vue"),
    name: "Find Friends",
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
