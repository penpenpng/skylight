<script setup lang="ts">
import { useRoute } from "vue-router";

import { deleteSession } from "@/lib/bsky";

const route = useRoute();

const logout = () => {
  deleteSession();
  location.reload();
};

const tabs = [
  {
    routeName: "index",
    label: "Home",
  },
  {
    routeName: "notifications",
    label: "Noti",
  },
  {
    routeName: "search",
    label: "Search",
  },
  {
    routeName: "my-profile",
    label: "Profile",
  },
  {
    routeName: "settings",
    label: "Settings",
  },
];
</script>

<template>
  <div class="columns col-oneline p-2">
    <h1 class="col-10" style="font-family: 'Segoe UI Mono'">Skylight</h1>
    <button
      v-if="route.name !== 'login'"
      class="btn btn-link col-ml-auto"
      @click="logout"
    >
      Logout
    </button>
  </div>

  <div class="sticky-area">
    <ul v-if="route.name !== 'login'" class="tab">
      <li
        v-for="({ routeName, label }, idx) in tabs"
        :key="idx"
        class="tab-item"
        :class="{ active: route.name === routeName }"
      >
        <RouterLink :to="{ name: routeName }">{{ label }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sticky-area {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
