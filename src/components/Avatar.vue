<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: null,
  },
  displayName: {
    type: String,
    default: null,
  },
  handle: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "lg",
  },
});
</script>

<template>
  <figure v-if="src" :class="`avatar avatar-${size}`">
    <img :src="src" alt="" />
  </figure>
  <figure
    v-else
    :class="`avatar avatar-${size}`"
    :data-initial="(displayName || handle)[0]"
  ></figure>
</template>
