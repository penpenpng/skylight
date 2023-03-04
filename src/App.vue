<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import Loadable from "./components/Loadable.vue";
</script>

<template>
  <main class="m-2 p-2">
    <TheHeader />
    <Loadable>
      <RouterView />
    </Loadable>
  </main>
</template>

<style>
.pre-line {
  white-space: pre-line;
}

.hoverable:hover {
  background: #f1f1fc;
}

.wrap-anywhere {
  overflow-wrap: anywhere;
}
</style>
