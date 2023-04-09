<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  onClick: {
    type: Function,
    default: undefined,
  },
  forceLoading: {
    type: Boolean,
  },
});

const loading = ref(false);

const handler = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  await Promise.resolve(props.onClick?.());
  loading.value = false;
};
</script>

<template>
  <button :class="{ loading: loading || forceLoading }" @click="handler">
    <slot />
  </button>
</template>
