<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import Loadable from "@/components/common/Loadable.vue";
import Profile from "@/components/user/Profile.vue";

defineProps({
  actor: {
    type: String,
    required: true,
  },
});

const notFound = ref(false);

onErrorCaptured(() => {
  notFound.value = true;
  return true;
});
</script>

<template>
  <div v-if="notFound" class="empty">
    <p class="empty-title h5">User Not Found</p>
  </div>

  <div v-else style="margin-top: 30px">
    <Loadable>
      <Profile :actor="actor" />
    </Loadable>
  </div>
</template>
