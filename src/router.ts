import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import PageLogin from "@/pages/PageLogin.vue";
import PageIndex from "@/pages/PageIndex.vue";
import PageNoti from "@/pages/PageNoti.vue";
import PageSearchUser from "@/pages/PageSearchUser.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PagePost from "@/pages/PageProfile.vue";
import PageSettings from "@/pages/PageSettings.vue";

import { isMe, tryResumeSession } from "@/lib/atp";

const assumeLogin: RouteRecordRaw["beforeEnter"] = async (to, from, next) => {
  const { success } = await tryResumeSession();
  if (success) {
    next();
  } else {
    next({ name: "login" });
  }
};

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
      beforeEnter: assumeLogin,
    },
    {
      name: "notifications",
      path: "/notifications",
      component: PageNoti,
      beforeEnter: assumeLogin,
    },
    {
      name: "search",
      path: "/search",
      component: PageSearchUser,
      beforeEnter: assumeLogin,
    },
    {
      name: "my-profile",
      path: "/profile",
      component: PageProfile,
      beforeEnter: assumeLogin,
    },
    {
      name: "profile",
      path: "/profile/:actor",
      component: PageProfile,
      props: true,
      beforeEnter: async (to, from, next) => {
        const { success } = await tryResumeSession();
        if (!success) {
          next({ name: "login" });
        } else if (isMe(to.params.actor as string)) {
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
