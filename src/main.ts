import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "spectre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "@/App.vue";
import { router } from "@/router";
import { tryResumeSession } from "@/lib/bsky";
import { queryClient } from "@/lib/query";

createApp(App).use(VueQueryPlugin, { queryClient }).use(router).mount("#app");

tryResumeSession().then(({ success }) => {
  if (!success) {
    router.replace({ name: "login" });
  }
});
