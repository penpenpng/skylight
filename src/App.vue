<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import Loadable from "./components/Loadable.vue";
</script>

<template>
  <main class="m-2 p-2">
    <TheHeader />

    <div class="main-view">
      <Loadable>
        <RouterView />
      </Loadable>
    </div>
  </main>
</template>

<style scoped>
.main-view {
  z-index: 1;
}
</style>

<style>
.btn-link.btn-icon {
  padding: 0;
  height: 1.1rem;
  width: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

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
