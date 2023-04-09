import "spectre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";

import App from "@/App.vue";
import { tryResumeSession } from "@/lib/bsky";
import { queryClient } from "@/lib/query";
import { router } from "@/router";

createApp(App).use(VueQueryPlugin, { queryClient }).use(router).mount("#app");

tryResumeSession().then(({ success }) => {
  if (!success) {
    router.replace({ name: "login" });
  }
});
