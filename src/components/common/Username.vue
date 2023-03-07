<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  user: {
    type: Object as PropType<{
      displayName?: string;
      handle: string;
    }>,
    required: true,
  },
  fontWeightNormal: {
    type: Boolean,
  },
});
</script>

<template>
  <RouterLink
    :to="{ name: 'profile', params: { actor: user.handle } }"
    class="text-primary"
    :class="{ 'text-bold': !fontWeightNormal }"
    >{{ user?.displayName || user.handle }}</RouterLink
  >
</template>
