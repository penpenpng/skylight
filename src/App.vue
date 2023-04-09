<script setup lang="ts">
import { onErrorCaptured } from "vue";
import { useRoute, useRouter } from "vue-router";

import Loadable from "@/components/common/Loadable.vue";
import TheHeader from "@/components/TheHeader.vue";
import { AtpError } from "@/lib/bsky";

const route = useRoute();
const router = useRouter();

onErrorCaptured((err) => {
  if (err instanceof AtpError) {
    router.push({ name: "login" });
  } else {
    throw err;
  }
});
</script>

<template>
  <main>
    <TheHeader />

    <div class="main-view">
      <Loadable>
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </RouterView>
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  padding: 0;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding: 0;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  padding: 0;
}
</style>
