<script setup lang="ts">
defineEmits<{ (ev: "click"): void }>();
defineProps({
  ariaLabel: {
    type: String,
  },
  iconClass: {
    type: String,
  },
});
</script>

<template>
  <div class="tile-post-action-button d-inline-flex">
    <button class="btn btn-link btn-icon mr-1" @click.stop="$emit('click')">
      <i :class="iconClass" :aria-label="ariaLabel"></i>
    </button>
    <slot />
  </div>
</template>

<style scoped>
.tile-post-action-button {
  width: 50px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}
</style>
