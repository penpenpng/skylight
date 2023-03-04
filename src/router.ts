import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import PageLogin from "@/pages/PageLogin.vue";
import PageIndex from "@/pages/PageIndex.vue";
import PageSearchUser from "@/pages/PageSearchUser.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PageSettings from "@/pages/PageSettings.vue";

import { tryResumeSession } from "@/lib/atp";

const assumeLogin: RouteRecordRaw["beforeEnter"] = async (to, from, next) => {
  const { success } = await tryResumeSession();
  if (success) {
    next();
  } else {
    next({ name: "login" });
  }
};

export const router = createRouter({
  history: createWebHashHistory("/skylight/dist/"),
  routes: [
    {
      name: "login",
      path: "/login",
      component: PageLogin,
    },
    {
      name: "index",
      path: "/",
      component: PageIndex,
      beforeEnter: assumeLogin,
    },
    {
      name: "search",
      path: "/search",
      component: PageSearchUser,
      beforeEnter: assumeLogin,
    },
    {
      name: "profile",
      path: "/profile",
      component: PageProfile,
      beforeEnter: assumeLogin,
    },
    {
      name: "settings",
      path: "/settings",
      component: PageSettings,
      beforeEnter: assumeLogin,
    },
  ],
});
