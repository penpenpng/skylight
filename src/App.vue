<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { useRoute } from "vue-router";
import Loadable from "./components/common/Loadable.vue";

const route = useRoute();
</script>

<template>
  <main>
    <TheHeader />

    <div class="main-view">
      <Loadable>
        <RouterView :key="route.path" />
      </Loadable>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: auto;
}

.main-view {
  z-index: 1;
}
</style>

<style>
body,
#app {
  width: 100%;
  margin: 0;
}

#app {
  padding: 10px;
}

.mt-3 {
  margin-top: 12px;
}

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
