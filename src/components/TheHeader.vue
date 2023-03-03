<script setup lang="ts">
import { useRoute } from "vue-router";
import { deleteSession } from "@/lib/atp";

const route = useRoute();

const logout = () => {
  deleteSession();
  location.reload();
};
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
    <li class="tab-item" :class="{ active: route.name === 'index' }">
      <RouterLink :to="{ name: 'index' }">Home</RouterLink>
    </li>
    <li class="tab-item" :class="{ active: route.name === 'search' }">
      <RouterLink :to="{ name: 'search' }">Search</RouterLink>
    </li>
  </ul>
</template>
