import { createRouter, createWebHashHistory } from "vue-router";

import { getMyHandle } from "@/lib/bsky";
import PageIndex from "@/pages/PageIndex.vue";
import PageLogin from "@/pages/PageLogin.vue";
import PageNoti from "@/pages/PageNoti.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PageSearchUser from "@/pages/PageSearchUser.vue";
import PageSettings from "@/pages/PageSettings.vue";

import { resolveDidToHandleForNavigationGuard } from "./lib/query";

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
      name: "profile",
      path: "/profile/:actor",
      component: PageProfile,
      props: true,
      beforeEnter: async (to, from, next) => {
        const actor = to.params.actor as string;

        if (actor.startsWith("did:")) {
          const handle = await resolveDidToHandleForNavigationGuard(actor);
          next({ name: "profile", params: { actor: handle } });
          return;
        }

        next();
      },
    },
    // NOTE: Not implemented
    // {
    //   name: "post",
    //   path: "/profile/:actor/post/:rkey",
    //   component: PagePost,
    //   props: true,
    //   beforeEnter: async (to, from, next) => {
    //     const actor = to.params.actor as string;

    //     if (actor.startsWith("did:")) {
    //       const handle = await resolveDidToHandleForNavigationGuard(actor);
    //       next({
    //         name: "post",
    //         params: { actor: handle, rkey: to.params.rkey },
    //       });
    //       return;
    //     }

    //     next();
    //   },
    // },
    {
      name: "settings",
      path: "/settings",
      component: PageSettings,
    },
    {
      name: "my-profile",
      path: "/profile",
      redirect: () => ({
        name: "profile",
        params: {
          actor: getMyHandle(),
        },
      }),
    },
    // NOTE: Not implemented
    // {
    //   name: "post-uri-resolver",
    //   path: "/post/:uri",
    //   redirect: (to) => {
    //     const uri = to.params.uri as string;
    //     const { did, rkey } = parseUri(uri);

    //     return {
    //       name: "post",
    //       params: {
    //         actor: did,
    //         rkey,
    //       },
    //     };
    //   },
    // },
  ],
});
