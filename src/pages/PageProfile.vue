<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";

import Loadable from "@/components/common/Loadable.vue";
import ActorProfile from "@/components/user/ActorProfile.vue";

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
      <ActorProfile :actor="actor" />
    </Loadable>
  </div>
</template>
