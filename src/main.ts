import { createApp } from "vue";
import "spectre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "@/App.vue";
import { router } from "@/router";

createApp(App).use(router).mount("#app");
