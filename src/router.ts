import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("./pages/HomePage.vue") },
  { path: "/discover", component: () => import("./pages/DiscoverPage.vue") },
  { path: "/game/:id", component: () => import("./pages/GamePage.vue") },
  { path: "/session/:id", component: () => import("./pages/SessionPage.vue") },
  { path: "/auth/:choice", component: () => import("./pages/AuthPage.vue") },
  { path: "/archive", component: () => import("./pages/ArchivePage.vue") },
  { path: "/profile/:id", component: () => import("./pages/ProfilePage.vue") },
];

export const router = createRouter({
    history: createWebHistory(),
    routes
})