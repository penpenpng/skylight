<script setup lang="ts">
import { useRoute } from "vue-router";
import { deleteSession } from "@/lib/atp";

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
    routeName: "search",
    label: "Search",
  },
  {
    routeName: "profile",
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
</template>
