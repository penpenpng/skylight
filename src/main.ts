import { createApp } from "vue";
import { VueQueryPlugin } from "vue-query";
import "spectre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "@/App.vue";
import { router } from "@/router";

createApp(App)
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          suspense: true,
        },
      },
    },
  })
  .use(router)
  .mount("#app");
