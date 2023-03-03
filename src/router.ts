import { createRouter, createWebHashHistory } from "vue-router";

import PageIndex from "@/pages/PageIndex.vue";
import PageLogin from "@/pages/PageLogin.vue";
import { tryResumeSession } from "./lib/atp";

export const router = createRouter({
  history: createWebHashHistory("/skylight/dist/"),
  routes: [
    {
      name: "index",
      path: "/",
      component: PageIndex,
      beforeEnter: async (to, from, next) => {
        const { success } = await tryResumeSession();
        if (success) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    {
      name: "login",
      path: "/login",
      component: PageLogin,
    },
  ],
});
