import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import PageLogin from "@/pages/PageLogin.vue";
import PageIndex from "@/pages/PageIndex.vue";
import PageNoti from "@/pages/PageNoti.vue";
import PageSearchUser from "@/pages/PageSearchUser.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PagePost from "@/pages/PageProfile.vue";
import PageSettings from "@/pages/PageSettings.vue";

import { isMe } from "@/lib/atp";

export const router = createRouter({
  history: createWebHashHistory("/skylight/"),
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
    },
    {
      name: "notifications",
      path: "/notifications",
      component: PageNoti,
    },
    {
      name: "search",
      path: "/search",
      component: PageSearchUser,
    },
    {
      name: "my-profile",
      path: "/profile",
      component: PageProfile,
    },
    {
      name: "profile",
      path: "/profile/:actor",
      component: PageProfile,
      props: true,
      beforeEnter: async (to, from, next) => {
        if (isMe(to.params.actor as string)) {
          next({ name: "my-profile" });
        } else {
          next();
        }
      },
    },
    {
      name: "post",
      path: "/profile/:actor/post/:rkey",
      component: PagePost,
      props: true,
    },
    {
      name: "settings",
      path: "/settings",
      component: PageSettings,
    },
  ],
});
