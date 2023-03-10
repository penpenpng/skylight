import { createApp } from "vue";
import { VueQueryPlugin } from "vue-query";
import "spectre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "@/App.vue";
import { router } from "@/router";
import { tryResumeSession } from "./lib/atp";

createApp(App)
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          suspense: true,
          keepPreviousData: true,
          staleTime: Infinity,
          cacheTime: Infinity,
        },
      },
    },
  })
  .use(router)
  .mount("#app");

tryResumeSession().then(({ success }) => {
  if (!success) {
    router.replace({ name: "login" });
  }
});
